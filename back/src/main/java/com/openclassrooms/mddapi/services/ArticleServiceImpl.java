package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Article;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.dto.ArticleDTO;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.Optional;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final AuthenticationRepository authenticationRepository;

    private final ArticleRepository articleRepository;

    private final ModelMapper modelMapper;

    public ArticleServiceImpl(AuthenticationRepository authenticationRepository, ArticleRepository articleRepository, ModelMapper modelMapper) {
        this.authenticationRepository = authenticationRepository;
        this.articleRepository = articleRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Optional<String> createArticle(ArticleDTO articleDTO, Principal principalUser) throws IOException {
        Article article = modelMapper.map(articleDTO, Article.class);
        System.out.println(article);

        if (principalUser.getName().contains("@")) {
            authenticationRepository.findByEmail(principalUser.getName()).ifPresent(article::setOwner);
        } else {
            authenticationRepository.findByUsername(principalUser.getName()).ifPresent(article::setOwner);
        }

        articleRepository.save(article);
        return Optional.of("Article created !");
    }
}