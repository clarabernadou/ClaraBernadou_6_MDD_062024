package com.openclassrooms.mddapi.controllers;

import javax.validation.Valid;

import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.interfaces.ArticleService;

import org.springframework.validation.BindingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/")
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleDTO articleDTO, Principal principalUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new UnauthorizedException(errors);
        }

        return ResponseEntity.ok(new MessageResponse(articleService.createArticle(articleDTO, principalUser).get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticle(id));
    }

    @GetMapping("/")
    public ResponseEntity<?> getArticles() {
        return ResponseEntity.ok(articleService.getArticles());
    }
}