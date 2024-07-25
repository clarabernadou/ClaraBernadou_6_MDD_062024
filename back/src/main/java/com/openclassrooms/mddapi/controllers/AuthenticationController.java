package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.controllers.advice.exceptions.BadRequestException;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;
import com.openclassrooms.mddapi.model.TokenResponse;
import com.openclassrooms.mddapi.services.interfaces.AuthenticationService;
import com.openclassrooms.mddapi.services.interfaces.ValidationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final ValidationService validationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService, ValidationService validationService) {
        this.authenticationService = authenticationService;
        this.validationService = validationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse registerUser(@Valid @RequestBody RegisterDTO registerDTO) {
        validationService.validateRegister(registerDTO);
        return new TokenResponse(authenticationService.registerUser(registerDTO).orElseThrow(() -> new BadRequestException("Registration failed")));
    }

    @PostMapping("/login")
    public TokenResponse loginUser(@Valid @RequestBody LoginDTO loginDTO) {
        validationService.validateLogin(loginDTO);
        return new TokenResponse(authenticationService.loginUser(loginDTO).orElseThrow(() -> new BadRequestException("Login failed")));
    }
}