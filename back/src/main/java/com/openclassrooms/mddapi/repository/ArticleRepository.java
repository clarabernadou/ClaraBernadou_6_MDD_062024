package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.entity.Article;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ArticleRepository extends CrudRepository<Article, Long> {
    Optional<Article> findById(Long id);
    List<Article> findAll();
}
