package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.entity.Auth;
import com.openclassrooms.mddapi.entity.Theme;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.services.interfaces.ThemeService;
import com.openclassrooms.mddapi.services.interfaces.UserService;

@Service
public class ThemeServiceImpl implements ThemeService {

    private final ThemeRepository themeRepository;
    private final UserService userService;

    @Autowired
    public ThemeServiceImpl(ThemeRepository themeRepository, UserService userService) {
        this.themeRepository = themeRepository;
        this.userService = userService;
    }

    @Override
    public List<Theme> getThemes() {
        Iterable<Theme> themesIterable = themeRepository.findAll();
        return StreamSupport.stream(themesIterable.spliterator(), false)
                            .collect(Collectors.toList());
    }

    @Override
    public Optional<Theme> getTheme(Long id) {
        return themeRepository.findById(id);
    }

    @Override
    public Optional<String> subscribeTheme(Long id, Principal principalUser) {
        Theme theme = themeRepository.findById(id).orElseThrow(() -> new NotFoundException("Theme not found"));
        Auth user = userService.findUserByPrincipal(principalUser).orElseThrow(() -> new NotFoundException("User not found"));

        user.getSubscriptions().add(theme);
        userService.saveUser(user);
        return Optional.of("Subscribed to theme!");
    }

    @Override
    public Optional<String> unsubscribeTheme(Long id, Principal principalUser) {
        Theme theme = themeRepository.findById(id).orElseThrow(() -> new NotFoundException("Theme not found"));
        Auth user = userService.findUserByPrincipal(principalUser).orElseThrow(() -> new NotFoundException("User not found"));

        user.getSubscriptions().remove(theme);
        userService.saveUser(user);
        return Optional.of("Unsubscribed from theme!");
    }
}