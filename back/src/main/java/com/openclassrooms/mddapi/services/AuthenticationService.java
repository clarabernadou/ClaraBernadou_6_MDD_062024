package com.openclassrooms.mddapi.services;

import java.util.Optional;

import com.openclassrooms.mddapi.dto.AuthDTO;

public interface AuthenticationService {
    Optional<String>registerUser(AuthDTO authDTO);
}
