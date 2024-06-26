package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.ArticleService;

import org.springframework.validation.Errors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/articles")
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleDTO articleDTO, Principal principalUser, Errors errors) throws IOException {
        if(errors.hasErrors()) {
            return new ResponseEntity<>(new MessageResponse("error"), HttpStatus.UNAUTHORIZED);
        }

        System.out.println("articleDTO = " + articleDTO);
        return ResponseEntity.ok(new MessageResponse(articleService.createArticle(articleDTO, principalUser).get()));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticle(id));
    }

    @GetMapping("/articles")
    public ResponseEntity<?> getArticles() {
        return ResponseEntity.ok(articleService.getArticles());
    }
}