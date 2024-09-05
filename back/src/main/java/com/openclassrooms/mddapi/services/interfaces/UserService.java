package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.controllers.advice.exceptions.ConflictException;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.model.AuthResponse;

/**
 * Service interface for managing user-related operations
 * This interface defines methods for retrieving user information, updating user details,
 * and managing user authentication tokens.
 */
public interface UserService {

    /**
     * Retrieves user by their ID
     *
     * @param id ID of user to retrieve
     * @return Optional containing UserDTO if found, or empty if not found
     */
    Optional<UserDTO> getUserById(Long id);

    /**
     * Generates authentication response for given user
     * The response includes user details and JWT token
     *
     * @param userDTO user details
     * @return Optional containing AuthResponse with user details and JWT token
     */
    Optional<AuthResponse> me(UserDTO userDTO);

    /**
     * Updates details of user identified by their username
     * Checks for conflicts with existing usernames or emails before updating
     *
     * @param username username of user to update
     * @param userDTO new user details
     * @return Optional containing updated AuthResponse with user details and JWT token
     * @throws NotFoundException if user is not found
     * @throws ConflictException if new email or username already exists
     */
    Optional<AuthResponse> updateMe(String username, UserDTO userDTO);

    /**
     * Retrieves user by their username or email
     *
     * @param username username or email of user to retrieve
     * @return Optional containing UserDTO if found, or empty if not found
     */
    Optional<UserDTO> getUserByUsernameOrEmail(String username);

    /**
     * Finds user based on provided Principal
     *
     * @param principalUser Principal representing currently authenticated user
     * @return Optional containing Auth if found, or empty if not found
     */
    Optional<Auth> findUserByPrincipal(Principal principalUser);

    /**
     * Saves given user to repository
     *
     * @param user user to save
     */
    void saveUser(Auth user);
}
