package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.*;

import com.openclassrooms.mddapi.entity.Theme;

public interface ThemeService {
    /**
     * @param theme
     * @return
     */
    Optional<Theme> getTheme(Long id);

    /**
     * @param theme
     * @return
     */
    List<Theme> getAllThemes();

    /**
     * @param theme
     * @return
     */
    Optional<String> subscribeTheme(Long id, Principal principalUser);

    /**
     * @param theme
     * @return
     */
    Optional<String> unsubscribeTheme(Long id, Principal principalUser);
}
