package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.services.interfaces.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JWTService jwtService;

    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper, JWTService jwtService) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
    }

    @Override
    public Optional<UserDTO> getUserById(Long id) {
        Auth user = userRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("User not found"));
        return Optional.of(modelMapper.map(user, UserDTO.class));
    }

    @Override
    public Optional<AuthResponse> me(UserDTO userDTO) {
        AuthResponse authResponse = modelMapper.map(userDTO, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(userDTO.getEmail()));
        return Optional.of(authResponse);
    }

    @Override
    public Optional<AuthResponse> updateMe(String usernameOrEmail, UserDTO userDTO) {
        Auth user = userRepository.findByUsername(usernameOrEmail)
            .or(() -> userRepository.findByEmail(usernameOrEmail))
            .orElseThrow(() -> new NotFoundException("User not found"));

        boolean emailExists = userRepository.findByEmail(userDTO.getEmail())
            .filter(existingUser -> !existingUser.getEmail().equals(user.getEmail()))
            .isPresent();

        boolean usernameExists = userRepository.findByUsername(userDTO.getUsername())
            .filter(existingUser -> !existingUser.getUsername().equals(user.getUsername()))
            .isPresent();

        if (emailExists || usernameExists) throw new UnauthorizedException("User already exists!");

        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());

        userRepository.save(user);
        AuthResponse authResponse = modelMapper.map(user, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(user.getEmail()));
        return Optional.of(authResponse);
    }

    @Override
    public Optional<UserDTO> getUserByUsernameOrEmail(String usernameOrEmail) {
        Auth user = userRepository.findByUsername(usernameOrEmail)
            .or(() -> userRepository.findByEmail(usernameOrEmail))
            .orElseThrow(() -> new NotFoundException("User not found"));
        return Optional.of(modelMapper.map(user, UserDTO.class));
    }

    @Override
    public Optional<Auth> findUserByPrincipal(Principal principalUser) {
        return userRepository.findByUsername(principalUser.getName())
            .or(() -> userRepository.findByEmail(principalUser.getName()));
    }

    @Override
    public void saveUser(Auth user) {
        userRepository.save(user);
    }
}
