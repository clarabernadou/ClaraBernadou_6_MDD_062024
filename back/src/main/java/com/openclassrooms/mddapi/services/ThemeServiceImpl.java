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

/**
 * Service implementation for managing themes
 * This class implements {@link ThemeService} interface and provides
 * functionality for retrieving themes and managing user subscriptions to themes
 */
@Service
public class ThemeServiceImpl implements ThemeService {

    private final ThemeRepository themeRepository;
    private final UserService userService;

    /**
     * Constructs new ThemeServiceImpl with specified dependencies
     *
     * @param themeRepository repository for handling theme-related operations
     * @param userService service for handling user-related operations
     */
    @Autowired
    public ThemeServiceImpl(ThemeRepository themeRepository, UserService userService) {
        this.themeRepository = themeRepository;
        this.userService = userService;
    }

    /**
     * Retrieves all available themes
     *
     * @return list of all themes
     */
    @Override
    public List<Theme> getThemes() {
        Iterable<Theme> themesIterable = themeRepository.findAll();
        return StreamSupport.stream(themesIterable.spliterator(), false)
                            .collect(Collectors.toList());
    }

    /**
     * Retrieves theme by ID
     *
     * @param id ID of theme to retrieve
     * @return Optional containing theme if found, or empty if not found
     */
    @Override
    public Optional<Theme> getTheme(Long id) {
        return themeRepository.findById(id);
    }

    /**
     * Subscribes currently authenticated user to specified theme
     *
     * @param id ID of theme to subscribe to
     * @param principalUser currently authenticated user
     * @return Optional containing success message if subscription is successful
     * @throws NotFoundException if theme or user is not found
     */
    @Override
    public Optional<String> subscribeTheme(Long id, Principal principalUser) {
        Theme theme = themeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Theme not found"));
        Auth user = userService.findUserByPrincipal(principalUser)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.getSubscriptions().add(theme);
        userService.saveUser(user);
        return Optional.of("Subscribed to theme!");
    }

    /**
     * Unsubscribes currently authenticated user from specified theme
     *
     * @param id ID of theme to unsubscribe from
     * @param principalUser currently authenticated user
     * @return Optional containing success message if unsubscription is successful
     * @throws NotFoundException if theme or user is not found
     */
    @Override
    public Optional<String> unsubscribeTheme(Long id, Principal principalUser) {
        Theme theme = themeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Theme not found"));
        Auth user = userService.findUserByPrincipal(principalUser)
                .orElseThrow(() -> new NotFoundException("User not found"));

        user.getSubscriptions().remove(theme);
        userService.saveUser(user);
        return Optional.of("Unsubscribed from theme!");
    }
}