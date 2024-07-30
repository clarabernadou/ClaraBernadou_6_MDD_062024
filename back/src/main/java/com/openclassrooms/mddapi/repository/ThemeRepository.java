package com.openclassrooms.mddapi.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.openclassrooms.mddapi.entity.Theme;

public interface ThemeRepository extends CrudRepository<Theme, Long> {
    Optional<Theme> findById(Long id);
}
