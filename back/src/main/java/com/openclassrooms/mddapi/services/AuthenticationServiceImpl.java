package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.services.interfaces.AuthenticationService;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationRepository authenticationRepository;

    private final ModelMapper modelMapper;

    private final JWTService jwtService;

    private final BCryptPasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(AuthenticationRepository authenticationRepository, ModelMapper modelMapper, JWTService jwtService,BCryptPasswordEncoder passwordEncoder) {
        this.authenticationRepository = authenticationRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<String> registerUser(RegisterDTO registerDTO) {
        Auth auth = modelMapper.map(registerDTO, Auth.class);
        auth.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        if(authenticationRepository.findByEmail(registerDTO.getEmail()).isPresent());
        if(authenticationRepository.findByUsername(registerDTO.getUsername()).isPresent());

        authenticationRepository.save(auth);

        return Optional.of(jwtService.generateToken(registerDTO.getEmail()));
    }

    @Override
    public Optional<String> loginUser(LoginDTO loginDTO) {
        Optional<Auth> user = authenticationRepository.findByUsername(loginDTO.getEmailOrUsername());
        if (user.isEmpty()) user = authenticationRepository.findByEmail(loginDTO.getEmailOrUsername());

        if (user.isEmpty() || !passwordEncoder.matches(loginDTO.getPassword(), user.get().getPassword())) throw new UnauthorizedException("Invalid credentials !");

        return Optional.of(jwtService.generateToken(loginDTO.getEmailOrUsername()));
    }
}