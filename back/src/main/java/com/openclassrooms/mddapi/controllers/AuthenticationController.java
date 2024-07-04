package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.dto.AuthDTO;
import com.openclassrooms.mddapi.exceptions.NotFoundException;
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
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthDTO authDTO) {
        Optional<String> token = authenticationService.registerUser(authDTO);

        if(token.isEmpty()) return new ResponseEntity<>(new MessageResponse("error"), HttpStatus.UNAUTHORIZED);

        return ResponseEntity.ok(new TokenResponse(token.get()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthDTO authDTO) {
        Optional<String> token = authenticationService.loginUser(authDTO);

        if(token.isEmpty()) return new ResponseEntity<>(new MessageResponse("error"), HttpStatus.UNAUTHORIZED);

        return ResponseEntity.ok(new TokenResponse(token.get()));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Principal principalUser, AuthDTO authDTO){
        if(principalUser == null) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        return ResponseEntity.ok(authenticationService.me(principalUser.getName(), principalUser, authDTO));
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateMe(Principal principalUser, @Valid @RequestBody AuthDTO authDTO){
        if(principalUser == null) throw new NotFoundException("User is not found");

        return ResponseEntity.ok(authenticationService.updateMe(principalUser.getName(), principalUser, authDTO));
    }

    @PostMapping("/subscribe/{id}")
    public ResponseEntity<Optional<String>> subscription (Principal principalUser, @PathVariable Long id){
        if(principalUser == null) throw new NotFoundException("User is not found");

        return ResponseEntity.ok(authenticationService.subscription(principalUser, id));
    }

}