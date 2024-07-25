package com.openclassrooms.mddapi.dto;

import lombok.Data;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ArticleDTO {
    private Long id;

    @JsonProperty("theme_id")
    private Long themeId;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @JsonProperty("owner_id")
    private Long ownerId;

    @JsonProperty("created_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    private LocalDate createdAt;

    @JsonProperty("updated_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    private LocalDate updatedAt;
}