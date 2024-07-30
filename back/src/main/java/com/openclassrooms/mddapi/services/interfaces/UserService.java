package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.model.AuthResponse;

public interface UserService {
    /**
     * 
     * @param id
     * @return
     */
    Optional<UserDTO> getUserById(Long id);

    /**
     * 
     * @param email
     * @return
     */
    Optional<AuthResponse> me(UserDTO userDTO);

    /**
     * 
     * @param username
     * @param userDTO
     * @return
     */
    Optional<AuthResponse> updateMe(String username, UserDTO userDTO);

    /**
     * 
     * @param username
     * @return
     */
    Optional<UserDTO> getUserByUsernameOrEmail(String username);

    /**
     * 
     * @param principalUser
     * @return
     */
    Optional<Auth> findUserByPrincipal(Principal principalUser);

    /**
     * 
     * @param user
     */
    void saveUser(Auth user);
}
