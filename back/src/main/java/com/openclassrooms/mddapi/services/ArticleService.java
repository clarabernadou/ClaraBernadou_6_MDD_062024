package com.openclassrooms.mddapi.services;

import java.io.IOException;
import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.dto.ArticleDTO;

public interface ArticleService {
    Optional<String>createArticle(ArticleDTO articleDTO, Principal principalUser) throws IOException;
}
