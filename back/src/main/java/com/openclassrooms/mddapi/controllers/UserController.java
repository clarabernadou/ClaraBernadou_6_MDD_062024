package com.openclassrooms.mddapi.controllers;

import java.security.Principal;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.services.interfaces.UserService;
import com.openclassrooms.mddapi.services.interfaces.ValidationService;

@RestController
@RequestMapping("/api/auth/user")
public class UserController {

    private final UserService userService;
    private final ValidationService validationService;

    @Autowired
    public UserController(UserService userService, ValidationService validationService) {
        this.userService = userService;
        this.validationService = validationService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO userDTO = userService.getUserById(id).orElseThrow(() -> new NotFoundException("User not found"));
        return ResponseEntity.ok(userDTO);
    }


    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Principal principalUser) {
        if (principalUser == null) {
            throw new UnauthorizedException("User is not authenticated");
        }

        UserDTO userDTO = userService.getUserByUsernameOrEmail(principalUser.getName())
                .orElseThrow(() -> new NotFoundException("User not found"));
        AuthResponse authResponse = userService.me(userDTO)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return ResponseEntity.ok(authResponse);
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateMe(Principal principalUser, @Valid @RequestBody UserDTO userDTO) {
        if (principalUser == null) {
            throw new UnauthorizedException("User is not authenticated");
        }

        validationService.validateUserUpdate(userDTO);
        AuthResponse authResponse = userService.updateMe(principalUser.getName(), userDTO)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return ResponseEntity.ok(authResponse);
    }
}