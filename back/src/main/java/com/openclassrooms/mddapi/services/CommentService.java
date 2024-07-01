package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.dto.CommentDTO;

public interface CommentService {
    Optional<String>createComment(CommentDTO commentDTO, Principal principalUser);
}
