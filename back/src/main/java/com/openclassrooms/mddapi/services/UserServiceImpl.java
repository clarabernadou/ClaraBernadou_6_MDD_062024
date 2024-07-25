package com.openclassrooms.mddapi.services;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.services.interfaces.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final AuthenticationRepository authenticationRepository;

    private final ModelMapper modelMapper;

    private final JWTService jwtService;

    public UserServiceImpl(AuthenticationRepository authenticationRepository, ModelMapper modelMapper, JWTService jwtService) {
        this.authenticationRepository = authenticationRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
    }

    @Override
    public Optional<UserDTO> getUserById(Long id) {
        Optional<Auth> user = authenticationRepository.findById(id);

        if (user.isEmpty()) throw new NotFoundException("User not found");

        return Optional.of(modelMapper.map(user.get(), UserDTO.class));
    }

    @Override
    public Optional<AuthResponse> me(UserDTO userDTO) {
        AuthResponse authResponse = modelMapper.map(userDTO, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(userDTO.getEmail()));
        return Optional.of(authResponse);
    }

    @Override
    public Optional<AuthResponse> updateMe(String usernameOrEmail, UserDTO userDTO) {
        Optional<Auth> user = authenticationRepository.findByEmail(usernameOrEmail);
        if(user.isEmpty()) user = authenticationRepository.findByUsername(usernameOrEmail);

        if (user.isEmpty()) throw new NotFoundException("User not found !");

        user.get().setEmail(userDTO.getEmail());
        user.get().setUsername(userDTO.getUsername());

        authenticationRepository.save(user.get());
        AuthResponse authResponse = modelMapper.map(user.get(), AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(user.get().getEmail()));
        return Optional.of(authResponse);

    }

    @Override
    public Optional<UserDTO> getUserByUsernameOrEmail(String usernameOrEmail) {
        Optional<Auth> user = authenticationRepository.findByEmail(usernameOrEmail);
        if(user.isEmpty()) user = authenticationRepository.findByUsername(usernameOrEmail);

        if (user.isEmpty()) throw new NotFoundException("User not found !");

        return Optional.of(modelMapper.map(user.get(), UserDTO.class));
    }
}
