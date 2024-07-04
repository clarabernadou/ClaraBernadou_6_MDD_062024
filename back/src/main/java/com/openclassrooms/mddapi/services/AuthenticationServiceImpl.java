package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.entity.Theme;
import com.openclassrooms.mddapi.exceptions.GlobalException;
import com.openclassrooms.mddapi.exceptions.NotFoundException;
import com.openclassrooms.mddapi.exceptions.UnauthorizedRequestException;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.dto.AuthDTO;

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
        authenticationRepository.save(user);

        return Optional.of(jwtService.generateToken(authDTO));
    }

    @Override
    public Optional<String> loginUser(AuthDTO authDTO) {
        Optional<Auth> user = Optional.empty();

        if (authDTO.getUsername() != null && !authDTO.getUsername().isEmpty()) {
            user = authenticationRepository.findByUsername(authDTO.getUsername());
        } else if (authDTO.getEmail() != null && !authDTO.getEmail().isEmpty()) {
            user = authenticationRepository.findByEmail(authDTO.getEmail());
        }

        if (user.isEmpty() || !passwordEncoder.matches(authDTO.getPassword(), user.get().getPassword())) throw new UnauthorizedRequestException("Invalid credentials !");
        return Optional.of(jwtService.generateToken(authDTO));
    }

    @Override
    public AuthResponse me(String usernameOrEmail, Principal principalUser, AuthDTO authDTO) {
        Optional<Auth> user = Optional.empty();

        if (usernameOrEmail.contains("@")) {
            user = authenticationRepository.findByEmail(usernameOrEmail);
        } else {
            user = authenticationRepository.findByUsername(usernameOrEmail);
        }

        if (user.isEmpty()) throw new NotFoundException("User not found !");
        return modelMapper.map(user.get(), AuthResponse.class);
    }

    @Override
    public AuthResponse updateMe(String usernameOrEmail, Principal principalUser, AuthDTO authDTO) {
        Optional<Auth> user = Optional.empty();

        if (usernameOrEmail.contains("@")) {
            user = authenticationRepository.findByEmail(usernameOrEmail);
        } else {
            user = authenticationRepository.findByUsername(usernameOrEmail);
        }

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
        Optional<Auth> user = Optional.empty();

        if (principalUser.getName().contains("@")) {
            user = authenticationRepository.findByEmail(principalUser.getName());
        } else {
            user = authenticationRepository.findByUsername(principalUser.getName());
        }

        if (user.isEmpty()) throw new NotFoundException("User not found !");
        if (theme.isEmpty()) throw new NotFoundException("Theme not found !");
        if (user.get().getSubscriptions().contains(theme.get())) throw new GlobalException("Subscription already exists !");

        user.get().getSubscriptions().add(theme.get());
        authenticationRepository.save(user.get());
        return Optional.of("Subscription added !");
    }

}