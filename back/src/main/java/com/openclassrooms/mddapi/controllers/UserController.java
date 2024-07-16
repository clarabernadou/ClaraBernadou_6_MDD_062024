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
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.services.interfaces.UserService;

@RestController
@RequestMapping("/api/auth/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Principal principalUser, UserDTO userDTO){
        if(principalUser == null) throw new NotFoundException("User is not found");

        return ResponseEntity.ok(userService.me(principalUser.getName(), principalUser, userDTO));
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateMe(Principal principalUser, @Valid @RequestBody UserDTO userDTO){
        if(principalUser == null) throw new NotFoundException("User is not found");

        return ResponseEntity.ok(userService.updateMe(principalUser.getName(), principalUser, userDTO));
    }
}