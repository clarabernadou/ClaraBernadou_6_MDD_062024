package com.openclassrooms.mddapi.controllers;

import java.security.Principal;
import java.util.Optional;
import java.util.stream.Collectors;

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

import com.openclassrooms.mddapi.controllers.advice.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.interfaces.CommentService;

@RestController
@RequestMapping("/api/auth")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/article/{articleId}/comment")
    public ResponseEntity<?> getComments(@PathVariable Long articleId) {
        return ResponseEntity.ok(commentService.getComments());
    }

    @PostMapping("/article/{articleId}/comment")
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentDTO commentDTO, @PathVariable Long articleId, Principal principalUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new UnauthorizedException(errors);
        }
        Optional<String> response = commentService.createComment(commentDTO, articleId, principalUser);
        return ResponseEntity.ok(new MessageResponse(response.get()));
    }
}
