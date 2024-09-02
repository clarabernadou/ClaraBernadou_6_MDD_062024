package com.openclassrooms.mddapi.services.interfaces;

import com.openclassrooms.mddapi.dto.CommentDTO;

import java.security.Principal;
import java.util.*;

/**
 * Service interface for managing comments
 * This interface defines contract for creating and retrieving comments
 */
public interface CommentService {

    /**
     * Retrieves all comments
     *
     * @return list of CommentDTOs representing all comments
     */
    List<CommentDTO> getComments();

    /**
     * Creates new comment associated with specified article
     *
     * @param commentDTO DTO containing comment data
     * @param articleId ID of article to which comment is associated
     * @param principalUser currently authenticated user
     * @return Optional containing success message if comment is created
     */
    Optional<String> createComment(CommentDTO commentDTO, Long articleId, Principal principalUser);
}
