package com.openclassrooms.mddapi.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AuthDTO {
    @NotBlank
    private String email;

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}