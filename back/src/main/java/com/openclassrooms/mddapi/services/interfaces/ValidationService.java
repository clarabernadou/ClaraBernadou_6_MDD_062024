package com.openclassrooms.mddapi.services.interfaces;

import org.springframework.validation.BindingResult;

import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;
import com.openclassrooms.mddapi.dto.UserDTO;

/**
 * Service interface for validating various Data Transfer Objects (DTOs)
 * Provides methods for validating input data to ensure it meets required constraints
 */
public interface ValidationService {

    /**
     * Validates ArticleDTO object
     * 
     * @param articleDTO ArticleDTO object to validate
     * @throws javax.validation.ValidationException if validation errors are found
     */
    void validateArticle(ArticleDTO articleDTO);

    /**
     * Validates RegisterDTO object
     * 
     * @param registerDTO RegisterDTO object to validate
     * @throws javax.validation.ValidationException if validation errors are found
     */
    void validateRegister(RegisterDTO registerDTO);

    /**
     * Validates LoginDTO object
     * 
     * @param loginDTO LoginDTO object to validate
     * @throws javax.validation.ValidationException if validation errors are found
     */
    void validateLogin(LoginDTO loginDTO);

    /**
     * Validates CommentDTO object
     * 
     * @param commentDTO CommentDTO object to validate
     * @param bindingResult BindingResult object for additional validation feedback
     * @throws javax.validation.ValidationException if validation errors are found
     */
    void validateComment(CommentDTO commentDTO, BindingResult bindingResult);

    /**
     * Validates UserDTO object for user update operations
     * 
     * @param userDTO UserDTO object to validate
     * @throws javax.validation.ValidationException if validation errors are found
     */
    void validateUserUpdate(UserDTO userDTO);
}
