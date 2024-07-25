package com.openclassrooms.mddapi.controllers;

import java.security.Principal;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.interfaces.CommentService;
import com.openclassrooms.mddapi.services.interfaces.ValidationService;

@RestController
@RequestMapping("/api/auth")
public class CommentController {

    private final CommentService commentService;
    private final ValidationService validationService;

    @Autowired
    public CommentController(CommentService commentService, ValidationService validationService) {
        this.commentService = commentService;
        this.validationService = validationService;
    }

    @GetMapping("/article/{articleId}/comment")
    public ResponseEntity<?> getComments(@PathVariable Long articleId) {
        return ResponseEntity.ok(commentService.getComments());
    }

    @PostMapping("/article/{articleId}/comment")
    public ResponseEntity<MessageResponse> createComment(@Valid @RequestBody CommentDTO commentDTO, @PathVariable Long articleId, Principal principalUser, BindingResult bindingResult) {
        validationService.validateComment(commentDTO, bindingResult);
        return ResponseEntity.ok(new MessageResponse(commentService.createComment(commentDTO, articleId, principalUser).get()));
    }
}