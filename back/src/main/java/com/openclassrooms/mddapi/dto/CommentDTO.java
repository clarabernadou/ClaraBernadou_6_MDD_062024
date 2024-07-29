package com.openclassrooms.mddapi.dto;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CommentDTO {

    @NotBlank
    private String content;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("article_id")
    private Long articleId;
}
