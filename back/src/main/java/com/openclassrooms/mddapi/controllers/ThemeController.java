package com.openclassrooms.mddapi.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.entity.Theme;
import com.openclassrooms.mddapi.services.interfaces.ThemeService;

@RestController
@RequestMapping("/api/auth/theme")
public class ThemeController {

    private final ThemeService themeService;

    @Autowired
    public ThemeController(ThemeService themeService) {
        this.themeService = themeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Theme>> getTheme(@PathVariable Long id) {
        return ResponseEntity.ok(themeService.getTheme(id));
    }

    @GetMapping("/")
    public ResponseEntity<List<Theme>> getThemes() {
        return ResponseEntity.ok(themeService.getThemes());
    }

    @PostMapping("/subscribe/{id}")
    public ResponseEntity<Optional<String>> subscribeTheme(@PathVariable Long id, Principal principalUser) {
        return ResponseEntity.ok(themeService.subscribeTheme(id, principalUser));
    }

    @DeleteMapping("/unsubscribe/{id}")
    public ResponseEntity<Optional<String>> unsubscribeTheme(@PathVariable Long id, Principal principalUser) {
        return ResponseEntity.ok(themeService.unsubscribeTheme(id, principalUser));
    }
}