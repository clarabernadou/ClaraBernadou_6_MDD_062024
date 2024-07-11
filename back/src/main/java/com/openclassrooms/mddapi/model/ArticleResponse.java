package com.openclassrooms.mddapi.model;

import java.util.List;

import com.openclassrooms.mddapi.dto.ArticleDTO;

import lombok.Data;

@Data
public class ArticleResponse extends ArticleDTO {

    private List<ArticleDTO> articles;
}
