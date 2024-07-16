package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.model.AuthResponse;

public interface UserService {
    /**
     * 
     * @param email
     * @param principalUser
     * @param userDTO
     * @return
     */
    AuthResponse me(String email, Principal principalUser, UserDTO userDTO);

    /**
     * 
     * @param email
     * @param principalUser
     * @param userDTO
     * @return
     */
    AuthResponse updateMe(String email, Principal principalUser, UserDTO userDTO);

    /**
     * 
     * @param principalUser
     * @param themeId
     * @return
     */
    Optional<String> subscription(Principal principalUser, Long themeId);

    /**
     * 
     * @param principalUser
     * @param themeId
     * @return
     */
    Optional<UserDTO> getUser(Long id); 
}
