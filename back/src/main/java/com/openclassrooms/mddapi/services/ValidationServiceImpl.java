package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;
import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.services.interfaces.ValidationService;

import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;

import javax.validation.ValidationException;
import java.util.stream.Collectors;

/**
 * Implementation of ValidationService interface for validating various DTOs
 * Uses Spring's Validator to validate fields of provided DTOs
 */
@Service
public class ValidationServiceImpl implements ValidationService {

    private final Validator validator;

    /**
     * Constructs ValidationServiceImpl with given Validator
     *
     * @param validator Validator to use for validation
     */
    public ValidationServiceImpl(Validator validator) {
        this.validator = validator;
    }

    /**
     * Validates an ArticleDTO object
     * Throws ValidationException if any validation errors are found
     *
     * @param articleDTO ArticleDTO object to validate
     * @throws ValidationException if validation errors are found
     */
    @Override
    public void validateArticle(ArticleDTO articleDTO) {
        BindingResult bindingResult = new BeanPropertyBindingResult(articleDTO, "articleDTO");
        validator.validate(articleDTO, bindingResult);

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new ValidationException(errors);
        }
    }

    /**
     * Validates RegisterDTO object
     * Throws ValidationException if any validation errors are found
     *
     * @param registerDTO RegisterDTO object to validate
     * @throws ValidationException if validation errors are found
     */
    @Override
    public void validateRegister(RegisterDTO registerDTO) {
        BindingResult bindingResult = new BeanPropertyBindingResult(registerDTO, "registerDTO");
        validator.validate(registerDTO, bindingResult);

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new ValidationException(errors);
        }
    }

    /**
     * Validates LoginDTO object
     * Throws ValidationException if any validation errors are found
     *
     * @param loginDTO LoginDTO object to validate
     * @throws ValidationException if validation errors are found
     */
    @Override
    public void validateLogin(LoginDTO loginDTO) {
        BindingResult bindingResult = new BeanPropertyBindingResult(loginDTO, "loginDTO");
        validator.validate(loginDTO, bindingResult);

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new ValidationException(errors);
        }
    }

    /**
     * Validates CommentDTO object
     * Throws ValidationException if any validation errors are found
     *
     * @param commentDTO CommentDTO object to validate
     * @param bindingResult BindingResult object for additional validation feedback
     * @throws ValidationException if validation errors are found
     */
    @Override
    public void validateComment(CommentDTO commentDTO, BindingResult bindingResult) {
        BindingResult result = new BeanPropertyBindingResult(commentDTO, "commentDTO");
        validator.validate(commentDTO, result);

        if (result.hasErrors()) {
            String errors = result.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new ValidationException(errors);
        }
    }

    /**
     * Validates UserDTO object for user update operations
     * Throws ValidationException if any validation errors are found
     *
     * @param userDTO UserDTO object to validate
     * @throws ValidationException if validation errors are found
     */
    @Override
    public void validateUserUpdate(UserDTO userDTO) {
        BindingResult bindingResult = new BeanPropertyBindingResult(userDTO, "userDTO");
        validator.validate(userDTO, bindingResult);

        if (bindingResult.hasErrors()) {
            String errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
            throw new ValidationException(errors);
        }
    }
}