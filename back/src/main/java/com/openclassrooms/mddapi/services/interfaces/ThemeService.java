package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.*;

import com.openclassrooms.mddapi.entity.Theme;

public interface ThemeService {
    /**
     * 
     * @return
     */
    List<Theme> getThemes();

    /**
     * 
     * @param id
     * @return
     */
    Optional<Theme> getTheme(Long id);

    /**
     * 
     * @param theme
     * @param principalUser
     * @return
     */
    Optional<String> subscribeTheme(Long id, Principal principalUser);

    /**
     * 
     * @param id
     * @param principalUser
     * @return
     */
    Optional<String> unsubscribeTheme(Long id, Principal principalUser);
}