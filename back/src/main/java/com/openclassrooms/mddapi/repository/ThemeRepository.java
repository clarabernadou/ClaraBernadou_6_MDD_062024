package com.openclassrooms.mddapi.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.openclassrooms.mddapi.entity.Theme;

import java.util.*;

@Repository
public interface ThemeRepository extends CrudRepository<Theme, Long> {
    Optional<Theme> findById(Long id);
    List<Theme> findAll();
}
