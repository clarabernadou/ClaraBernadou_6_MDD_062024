package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.entity.Theme;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.controllers.advice.exceptions.ConflictException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.AuthDTO;
import com.openclassrooms.mddapi.dto.LoginDTO;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationRepository authenticationRepository;

    private final ThemeRepository themeRepository;

    private final ModelMapper modelMapper;

    private final JWTService jwtService;

    private final BCryptPasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(AuthenticationRepository authenticationRepository, ThemeRepository themeRepository, ModelMapper modelMapper,
                                     JWTService jwtService,BCryptPasswordEncoder passwordEncoder) {
        this.authenticationRepository = authenticationRepository;
        this.themeRepository = themeRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<String> registerUser(AuthDTO authDTO) {
        Auth user = modelMapper.map(authDTO, Auth.class);
        user.setPassword(passwordEncoder.encode(authDTO.getPassword()));

        if(authenticationRepository.findByEmail(authDTO.getEmail()).isPresent()) throw new ConflictException("Email already exists !");
        if(authenticationRepository.findByUsername(authDTO.getUsername()).isPresent()) throw new ConflictException("Username already exists !");

        authenticationRepository.save(user);

        return Optional.of(jwtService.generateToken(authDTO.getEmail()));
    }

    @Override
    public Optional<String> loginUser(LoginDTO loginDTO) {
        Optional<Auth> user = authenticationRepository.findByUsername(loginDTO.getEmailOrUsername());

        if (user.isEmpty()) user = authenticationRepository.findByEmail(loginDTO.getEmailOrUsername());
        if (user.isEmpty() || !passwordEncoder.matches(loginDTO.getPassword(), user.get().getPassword())) throw new UnauthorizedException("Invalid credentials !");

        return Optional.of(jwtService.generateToken(loginDTO.getEmailOrUsername()));
    }

    @Override
    public AuthResponse me(String usernameOrEmail, Principal principalUser, AuthDTO authDTO) {
        Optional<Auth> user = authenticationRepository.findByEmail(usernameOrEmail);
        if(user.isEmpty()) user = authenticationRepository.findByUsername(usernameOrEmail);

        if (user.isEmpty()) throw new NotFoundException("User not found !");

        return modelMapper.map(user.get(), AuthResponse.class);
    }

    @Override
    public AuthResponse updateMe(String usernameOrEmail, Principal principalUser, AuthDTO authDTO) {
        Optional<Auth> user = authenticationRepository.findByEmail(usernameOrEmail);
        if(user.isEmpty()) user = authenticationRepository.findByUsername(usernameOrEmail);

        if (user.isEmpty()) throw new NotFoundException("User not found !");

        user.get().setEmail(authDTO.getEmail());
        user.get().setUsername(authDTO.getUsername());
        user.get().setPassword(passwordEncoder.encode(authDTO.getPassword()));
        authenticationRepository.save(user.get());
        return modelMapper.map(user.get(), AuthResponse.class);
    }

    @Override
    public Optional<String> subscription(Principal principalUser, Long themeId) {
        Optional<Theme> theme = themeRepository.findById(themeId);
        Optional<Auth> user = authenticationRepository.findByEmail(principalUser.getName());
        if(user.isEmpty()) user = authenticationRepository.findByUsername(principalUser.getName());

        if (user.isEmpty()) throw new NotFoundException("User not found !");
        if (theme.isEmpty()) throw new NotFoundException("Theme not found !");
        if (user.get().getSubscriptions().contains(theme.get())) throw new ConflictException("Subscription already exists !");

        user.get().getSubscriptions().add(theme.get());
        authenticationRepository.save(user.get());
        return Optional.of("Subscription added !");
    }

}