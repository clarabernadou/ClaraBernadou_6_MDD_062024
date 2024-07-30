package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.*;

import org.springframework.http.ResponseEntity;

import com.openclassrooms.mddapi.dto.ArticleDTO;

public interface ArticleService {
    /**
     * @param articleDTO
     * @param principalUser
     * @return
     * @throws Exception
    */
    Optional<String>createArticle(ArticleDTO articleDTO, Principal principalUser);

    /**
     * @param id
     * @return
     * @throws Exception
    */
    ResponseEntity<ArticleDTO> getArticle(Long id);

    /**
     * @return
     * @throws Exception
    */
    List<ArticleDTO> getArticles();
}
