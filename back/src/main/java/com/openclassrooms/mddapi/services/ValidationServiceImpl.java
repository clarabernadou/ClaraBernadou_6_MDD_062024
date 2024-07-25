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

@Service
public class ValidationServiceImpl implements ValidationService {

    private final Validator validator;

    public ValidationServiceImpl(Validator validator) {
        this.validator = validator;
    }

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
