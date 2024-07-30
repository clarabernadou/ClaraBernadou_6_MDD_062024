package com.openclassrooms.mddapi.dto;

import java.util.List;

import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.openclassrooms.mddapi.entity.Theme;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Username is mandatory")
    @Column(unique = true)
    private String username;

    private List<Theme> subscriptions;
}
