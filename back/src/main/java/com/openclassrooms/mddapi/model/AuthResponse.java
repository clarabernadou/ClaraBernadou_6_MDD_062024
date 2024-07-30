package com.openclassrooms.mddapi.model;

import java.util.List;

import com.openclassrooms.mddapi.dto.UserDTO;
import com.openclassrooms.mddapi.entity.Theme;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class AuthResponse extends UserDTO {
    private String token;

    private List<Theme> subscriptions;
}
