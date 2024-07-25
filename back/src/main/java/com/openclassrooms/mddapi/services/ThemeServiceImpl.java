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
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.services.interfaces.ThemeService;

@Service
public class ThemeServiceImpl implements ThemeService {

    private final ThemeRepository themeRepository;

    private final AuthenticationRepository authenticationRepository;

    @Autowired
    public ThemeServiceImpl(ThemeRepository themeRepository, AuthenticationRepository authenticationRepository) {
        this.themeRepository = themeRepository;
        this.authenticationRepository = authenticationRepository;
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
        Optional<Theme> theme = themeRepository.findById(id);
        Optional<Auth> user = authenticationRepository.findByEmail(principalUser.getName());
        if(user.isEmpty()) user = authenticationRepository.findByUsername(principalUser.getName());

        if (theme.isEmpty()) throw new NotFoundException("Theme not found");
        if (user.isEmpty()) throw new NotFoundException("User not found");

        user.get().getSubscriptions().add(theme.get());
        authenticationRepository.save(user.get());
        return Optional.of("Subscribed to theme !");
    }

    @Override
    public Optional<String> unsubscribeTheme(Long id, Principal principalUser) {
        Optional<Theme> theme = themeRepository.findById(id);
        Optional<Auth> user = authenticationRepository.findByEmail(principalUser.getName());
        if(user.isEmpty()) user = authenticationRepository.findByUsername(principalUser.getName());

        if (theme.isEmpty()) throw new NotFoundException("Theme not found");
        if (user.isEmpty()) throw new NotFoundException("User not found");

        user.get().getSubscriptions().remove(theme.get());
        authenticationRepository.save(user.get());
        return Optional.of("Unsubscribed from theme !");
    }
}