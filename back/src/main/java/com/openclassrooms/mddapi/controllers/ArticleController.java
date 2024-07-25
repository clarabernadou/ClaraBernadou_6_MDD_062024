package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.interfaces.ArticleService;
import com.openclassrooms.mddapi.services.interfaces.ValidationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/auth/article")
public class ArticleController {

    private final ArticleService articleService;
    private final ValidationService validationService;

    @Autowired
    public ArticleController(ArticleService articleService, ValidationService validationService) {
        this.articleService = articleService;
        this.validationService = validationService;
    }

    @PostMapping("/")
    public ResponseEntity<MessageResponse> createArticle(@Valid @RequestBody ArticleDTO articleDTO, Principal principalUser) {
        validationService.validateArticle(articleDTO);
        return ResponseEntity.ok(new MessageResponse(articleService.createArticle(articleDTO, principalUser).get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticle(@PathVariable Long id) {
        return articleService.getArticle(id);
    }

    @GetMapping("/")
    public ResponseEntity<List<ArticleDTO>> getArticles() {
        return ResponseEntity.ok(articleService.getArticles());
    }
}
