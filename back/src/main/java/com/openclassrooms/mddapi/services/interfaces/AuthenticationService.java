package com.openclassrooms.mddapi.services.interfaces;

import java.util.Optional;

import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;

public interface AuthenticationService {
    /**
     * 
     * @param authDTO
     * @return
     */
    Optional<String>registerUser(RegisterDTO registerDTO);

    /**
     * 
     * @param loginDTO
     * @return
     */
    Optional<String>loginUser(LoginDTO loginDTO);
}
