package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.dto.AuthDTO;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.model.AuthResponse;

public interface AuthenticationService {
    Optional<String>registerUser(AuthDTO authDTO);
    Optional<String>loginUser(LoginDTO loginDTO);
    AuthResponse me(String email, Principal principalUser, AuthDTO authDTO);
    AuthResponse updateMe(String email, Principal principalUser, AuthDTO authDTO);
    Optional<String> subscription(Principal principalUser, Long themeId);
}
