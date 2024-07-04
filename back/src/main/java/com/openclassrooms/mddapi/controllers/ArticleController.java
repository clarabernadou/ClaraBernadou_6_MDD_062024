package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.exceptions.UnauthorizedRequestException;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.ArticleService;

import org.springframework.validation.Errors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/articles")
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleDTO articleDTO, Principal principalUser, Errors errors) throws IOException {
        if(errors.hasErrors()) throw new UnauthorizedRequestException("User is not found");
        return ResponseEntity.ok(new MessageResponse(articleService.createArticle(articleDTO, principalUser).get()));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id, Errors errors) {
        if(errors.hasErrors()) throw new UnauthorizedRequestException("User is not found");
        return ResponseEntity.ok(articleService.getArticle(id));
    }

    @GetMapping("/articles")
    public ResponseEntity<?> getArticles(Errors errors) {
        if(errors.hasErrors()) throw new UnauthorizedRequestException("User is not found");
        return ResponseEntity.ok(articleService.getArticles());
    }
}