package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.controllers.advice.exceptions.BadRequestException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.AuthDTO;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.model.AuthResponse;
import com.openclassrooms.mddapi.model.TokenResponse;
import com.openclassrooms.mddapi.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse registerUser(@Valid @RequestBody AuthDTO authDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException(errors);
        }

        Optional<String> token = authenticationService.registerUser(authDTO);
        return new TokenResponse(token.orElseThrow(() -> new UnauthorizedException("Registration failed")));
    }

    @PostMapping("/login")
    public TokenResponse loginUser(@Valid @RequestBody LoginDTO loginDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException(errors);
        }

        Optional<String> token = authenticationService.loginUser(loginDTO);
        return new TokenResponse(token.orElseThrow(() -> new UnauthorizedException("Login failed")));
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