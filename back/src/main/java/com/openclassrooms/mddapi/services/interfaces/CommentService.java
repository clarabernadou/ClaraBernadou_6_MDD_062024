package com.openclassrooms.mddapi.services.interfaces;

import java.security.Principal;
import java.util.Optional;

import com.openclassrooms.mddapi.dto.CommentDTO;

public interface CommentService {
    /**
     * 
     * @param commentDTO
     * @param principalUser
     * @return
     */
    Optional<String>createComment(CommentDTO commentDTO, Principal principalUser);
}
