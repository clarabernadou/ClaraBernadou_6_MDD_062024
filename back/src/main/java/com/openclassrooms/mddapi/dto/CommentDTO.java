package com.openclassrooms.mddapi.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CommentDTO {

    @NotBlank
    private String content;

    @NotNull
    @JsonProperty("owner_id")
    private Long ownerId;

    @NotNull
    @JsonProperty("article_id")
    private Long articleId;
}
