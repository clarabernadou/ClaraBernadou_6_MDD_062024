package com.openclassrooms.mddapi.controllers;

import java.security.Principal;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.services.interfaces.ThemeService;

@RestController
@RequestMapping("/api/auth/theme")
public class ThemeController {

    private ThemeService themeService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getTheme(@PathVariable Long id) {
        return ResponseEntity.ok(themeService.getTheme(id));
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllThemes() {
        return ResponseEntity.ok(themeService.getAllThemes());
    }

    @PostMapping("/{id}/subscribe")
    public ResponseEntity<?> subscribeTheme(@PathVariable Long id, Principal principalUser) {
        Optional<String> response = themeService.subscribeTheme(id, principalUser);
        if (response.isEmpty()) throw new NotFoundException("Theme not found");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/unsubscribe")
    public ResponseEntity<?> unsubscribeTheme(@PathVariable Long id, Principal principalUser) {
        Optional<String> response = themeService.unsubscribeTheme(id, principalUser);
        if (response.isEmpty()) throw new NotFoundException("Theme not found");
        return ResponseEntity.ok(response);
    }
}
