package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.controllers.advice.exceptions.ConflictException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.entity.Theme;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.services.interfaces.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final AuthenticationRepository authenticationRepository;

    private final ModelMapper modelMapper;

    private final BCryptPasswordEncoder passwordEncoder;

    private final ThemeRepository themeRepository;

    public UserServiceImpl(AuthenticationRepository authenticationRepository, ModelMapper modelMapper, JWTService jwtService,BCryptPasswordEncoder passwordEncoder, ThemeRepository themeRepository) {
        this.authenticationRepository = authenticationRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.themeRepository = themeRepository;
    }

    @Override
    public Optional<UserDTO> getUser(Long id) {
        Optional<Auth> user = authenticationRepository.findById(id);

        if (user.isEmpty()) throw new NotFoundException("User not found");

        return Optional.of(modelMapper.map(user.get(), UserDTO.class));
    }

    @Override
    public AuthResponse me(String usernameOrEmail, Principal principalUser, UserDTO userDTO) {
        Optional<Auth> user = authenticationRepository.findByEmail(usernameOrEmail);
        if(user.isEmpty()) user = authenticationRepository.findByUsername(usernameOrEmail);

        if (user.isEmpty()) throw new NotFoundException("User not found !");

        return modelMapper.map(user.get(), AuthResponse.class);
    }

    @Override
    public AuthResponse updateMe(String usernameOrEmail, Principal principalUser, UserDTO userDTO) {
        Optional<Auth> user = authenticationRepository.findByEmail(usernameOrEmail);
        if(user.isEmpty()) user = authenticationRepository.findByUsername(usernameOrEmail);

        if (user.isEmpty()) throw new NotFoundException("User not found !");

        user.get().setEmail(userDTO.getEmail());
        user.get().setUsername(userDTO.getUsername());
        user.get().setPassword(passwordEncoder.encode(userDTO.getPassword()));
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
