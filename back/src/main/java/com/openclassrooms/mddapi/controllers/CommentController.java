package com.openclassrooms.mddapi.controllers;

import java.security.Principal;

import javax.validation.Valid;

import org.modelmapper.internal.Errors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.model.MessageResponse;
import com.openclassrooms.mddapi.services.CommentService;

@RestController
@RequestMapping("/api/auth")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/comments")
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentDTO commentDTO, Principal principalUser, Errors errors) {
        if(errors.hasErrors()) {
            return new ResponseEntity<>(new MessageResponse("error"), HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(new MessageResponse(commentService.createComment(commentDTO, principalUser).get()));
    }
}
