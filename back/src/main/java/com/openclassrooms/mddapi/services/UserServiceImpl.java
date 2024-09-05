package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.controllers.advice.exceptions.ConflictException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.services.interfaces.UserService;

/**
 * Service implementation for managing user-related operations
 * This class implements {@link UserService} interface and provides methods for
 * retrieving user information, updating user details, and managing authentication tokens
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JWTService jwtService;

    /**
     * Constructs new UserServiceImpl with specified dependencies
     *
     * @param userRepository repository for handling user-related operations
     * @param modelMapper mapper used for converting between entity and DTO
     * @param jwtService service used for generating JWT tokens
     */
    public UserServiceImpl(UserRepository userRepository, ModelMapper modelMapper, JWTService jwtService) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.jwtService = jwtService;
    }

    /**
     * Retrieves user by ID
     *
     * @param id ID of user to retrieve
     * @return Optional containing UserDTO if found, or empty if not found
     * @throws NotFoundException if user is not found
     */
    @Override
    public Optional<UserDTO> getUserById(Long id) {
        Auth user = userRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("User not found"));
        return Optional.of(modelMapper.map(user, UserDTO.class));
    }

    /**
     * Generates authentication response for given user
     * The response includes user details and JWT token
     *
     * @param userDTO user details
     * @return Optional containing AuthResponse with user details and JWT token
     */
    @Override
    public Optional<AuthResponse> me(UserDTO userDTO) {
        AuthResponse authResponse = modelMapper.map(userDTO, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(userDTO.getEmail()));
        return Optional.of(authResponse);
    }

    /**
     * Updates details of user identified by username or email
     * Checks for conflicts with existing usernames or emails before updating
     *
     * @param usernameOrEmail username or email of user to update
     * @param userDTO new user details
     * @return Optional containing updated AuthResponse with user details and JWT token
     * @throws NotFoundException if user is not found
     * @throws UnauthorizedException if new email or username already exists
     */
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

        if (emailExists || usernameExists) throw new ConflictException("User already exists!");

        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());

        userRepository.save(user);
        AuthResponse authResponse = modelMapper.map(user, AuthResponse.class);
        authResponse.setToken(jwtService.generateToken(user.getEmail()));
        return Optional.of(authResponse);
    }

    /**
     * Retrieves user by its username or email
     *
     * @param usernameOrEmail username or email of user to retrieve
     * @return Optional containing UserDTO if found, or empty if not found
     * @throws NotFoundException if user is not found
     */
    @Override
    public Optional<UserDTO> getUserByUsernameOrEmail(String usernameOrEmail) {
        Auth user = userRepository.findByUsername(usernameOrEmail)
            .or(() -> userRepository.findByEmail(usernameOrEmail))
            .orElseThrow(() -> new NotFoundException("User not found"));
        return Optional.of(modelMapper.map(user, UserDTO.class));
    }

    /**
     * Finds user based on provided Principal
     *
     * @param principalUser Principal representing currently authenticated user
     * @return Optional containing Auth if found, or empty if not found
     */
    @Override
    public Optional<Auth> findUserByPrincipal(Principal principalUser) {
        return userRepository.findByUsername(principalUser.getName())
            .or(() -> userRepository.findByEmail(principalUser.getName()));
    }

    /**
     * Saves given user to repository
     *
     * @param user user to save
     */
    @Override
    public void saveUser(Auth user) {
        userRepository.save(user);
    }
}
