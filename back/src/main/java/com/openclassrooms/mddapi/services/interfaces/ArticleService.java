package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.*;

import org.springframework.http.ResponseEntity;

import com.openclassrooms.mddapi.dto.ArticleDTO;

/**
 * Service interface for managing articles
 * This interface defines contract for creating, retrieving, and managing articles in system
 */
public interface ArticleService {

    /**
     * Creates a new article based on provided ArticleDTO
     *
     * @param articleDTO DTO containing article data
     * @param principalUser currently authenticated user
     * @return Optional containing a success message if article is created
     */
    Optional<String> createArticle(ArticleDTO articleDTO, Principal principalUser);

    /**
     * Retrieves article by ID
     *
     * @param id ID of article to retrieve
     * @return ResponseEntity containing ArticleDTO of requested article
     */
    ResponseEntity<ArticleDTO> getArticle(Long id);

    /**
     * Retrieves all articles
     *
     * @return list of ArticleDTOs representing all articles
     */
    List<ArticleDTO> getArticles();
}
