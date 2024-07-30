package com.openclassrooms.mddapi.services.interfaces;

import com.openclassrooms.mddapi.dto.CommentDTO;

import java.security.Principal;
import java.util.*;

public interface CommentService {
    /**
     * 
     * @return
     */
    List<CommentDTO> getComments();

    /**
     * 
     * @param commentDTO
     * @param articleId
     * @param principalUser
     * @return
     */
    Optional<String> createComment(CommentDTO commentDTO, Long articleId, Principal principalUser);
}
