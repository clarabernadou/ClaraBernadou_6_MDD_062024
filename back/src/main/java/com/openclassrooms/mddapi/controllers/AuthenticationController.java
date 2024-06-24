package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.dto.AuthDTO;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.model.TokenResponse;
import com.openclassrooms.mddapi.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;


@RestController
@RequestMapping("/api")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthDTO authDTO) {
        Optional<String> token = authenticationService.registerUser(authDTO);

        if(token.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse("error"), HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(new TokenResponse(token.get()));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthDTO authDTO) {
        Optional<String> token = authenticationService.loginUser(authDTO);

        if(token.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse("error"), HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(new TokenResponse(token.get()));
    }

    @GetMapping("/auth/me")
    public ResponseEntity<AuthResponse> me(Principal principalUser, AuthDTO authDTO){
        if(principalUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(authenticationService.me(principalUser.getName(), principalUser, authDTO));
    }

    @PutMapping("/auth/me")
    public ResponseEntity<AuthResponse> updateMe(Principal principalUser, @Valid @RequestBody AuthDTO authDTO){
        if(principalUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(authenticationService.updateMe(principalUser.getName(), principalUser, authDTO));
    }
}