package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.dto.AuthDTO;

import org.modelmapper.ModelMapper;
import org.springframework.security.access.method.P;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationRepository authenticationRepository;

    private final ModelMapper modelMapper;

    private final JWTService jwtService;

    private final BCryptPasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(AuthenticationRepository authenticationRepository, ModelMapper modelMapper,
                                     JWTService jwtService,BCryptPasswordEncoder passwordEncoder) {
        this.authenticationRepository = authenticationRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<String> registerUser(AuthDTO authDTO) {

        if(authenticationRepository.findByEmail(authDTO.getEmail()).isPresent()) {
            return Optional.empty();
        }
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
        }

        if (user.isEmpty() && authDTO.getEmail() != null && !authDTO.getEmail().isEmpty()) {
            user = authenticationRepository.findByEmail(authDTO.getEmail());
        }

        if (user.isEmpty() || !passwordEncoder.matches(authDTO.getPassword(), user.get().getPassword())) {
            return Optional.empty();
        }

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

        if (user.isPresent()) {
            return modelMapper.map(user.get(), AuthResponse.class);
        }

        return null;
    }
}