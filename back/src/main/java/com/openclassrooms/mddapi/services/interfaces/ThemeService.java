package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.*;

import com.openclassrooms.mddapi.entity.Theme;

/**
 * Service interface for managing themes
 * This interface defines contract for retrieving themes and managing user subscriptions to themes
 */
public interface ThemeService {

    /**
     * Retrieves all available themes
     *
     * @return list of all themes
     */
    List<Theme> getThemes();

    /**
     * Retrieves theme by ID
     *
     * @param id ID of theme to retrieve
     * @return Optional containing theme if found, or empty if not found
     */
    Optional<Theme> getTheme(Long id);

    /**
     * Subscribes currently authenticated user to specified theme
     *
     * @param id ID of theme to subscribe to
     * @param principalUser currently authenticated user
     * @return Optional containing success message if subscription is successful
     * @throws NotFoundException if theme or user is not found
     */
    Optional<String> subscribeTheme(Long id, Principal principalUser);

    /**
     * Unsubscribes currently authenticated user from specified theme
     *
     * @param id ID of theme to unsubscribe from
     * @param principalUser currently authenticated user
     * @return Optional containing success message if unsubscription is successful
     * @throws NotFoundException if theme or user is not found
     */
    Optional<String> unsubscribeTheme(Long id, Principal principalUser);
}
