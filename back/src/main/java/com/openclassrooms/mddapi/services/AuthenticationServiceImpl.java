package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.dto.AuthDTO;

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
}