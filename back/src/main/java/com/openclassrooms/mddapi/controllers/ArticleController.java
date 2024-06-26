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
}