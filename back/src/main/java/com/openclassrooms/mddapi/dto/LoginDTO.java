package com.openclassrooms.mddapi.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginDTO {
    @NotBlank(message = "Email or password is mandatory")
    private String emailOrUsername;

    @NotBlank(message = "Password is mandatory")
    private String password;
}