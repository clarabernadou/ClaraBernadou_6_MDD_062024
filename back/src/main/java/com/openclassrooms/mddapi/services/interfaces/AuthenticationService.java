package com.openclassrooms.mddapi.services.interfaces;

import java.util.Optional;

import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;

/**
 * Service interface for authentication operations
 * This interface defines contract for user registration and login functionalities.
 */
public interface AuthenticationService {

    /**
     * Registers new user based on provided RegisterDTO
     *
     * @param registerDTO DTO containing user's registration data
     * @return Optional containing JWT token if registration is successful
     */
    Optional<String> registerUser(RegisterDTO registerDTO);

    /**
     * Logs in user based on provided LoginDTO
     *
     * @param loginDTO DTO containing user's login credentials
     * @return Optional containing JWT token if login is successful
     */
    Optional<String> loginUser(LoginDTO loginDTO);
}
