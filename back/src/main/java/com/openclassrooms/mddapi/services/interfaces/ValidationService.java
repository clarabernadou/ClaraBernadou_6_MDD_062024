package com.openclassrooms.mddapi.services.interfaces;

import org.springframework.validation.BindingResult;

import com.openclassrooms.mddapi.dto.ArticleDTO;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.dto.LoginDTO;
import com.openclassrooms.mddapi.dto.RegisterDTO;
import com.openclassrooms.mddapi.dto.UserDTO;

public interface ValidationService {
    void validateArticle(ArticleDTO articleDTO);
    void validateRegister(RegisterDTO registerDTO);
    void validateLogin(LoginDTO loginDTO);
    void validateComment(CommentDTO commentDTO, BindingResult bindingResult);
    void validateUserUpdate(UserDTO userDTO);
}
