package com.openclassrooms.mddapi.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.openclassrooms.mddapi.dto.RegisterDTO;
import com.openclassrooms.mddapi.entity.Theme;

import lombok.Data;

@Data
public class AuthResponse extends RegisterDTO {

    @JsonProperty("created_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    private LocalDate createdAt;

    @JsonProperty("updated_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    private LocalDate updatedAt;

    private String token;

    private List<Theme> subscriptions;

    public AuthResponse orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }
}
