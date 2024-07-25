package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.entity.Article;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.services.interfaces.ArticleService;
import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.dto.ArticleDTO;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final AuthenticationRepository authenticationRepository;
    private final ArticleRepository articleRepository;
    private final ModelMapper modelMapper;

    public ArticleServiceImpl(AuthenticationRepository authenticationRepository, ArticleRepository articleRepository, ModelMapper modelMapper) {
        this.authenticationRepository = authenticationRepository;
        this.articleRepository = articleRepository;
        this.modelMapper = modelMapper;

        PropertyMap<ArticleDTO, Article> commentMap = new PropertyMap<ArticleDTO, Article>() {
            @Override
            protected void configure() {
                map().setId(source.getOwnerId());
            }
        };

        this.modelMapper.addMappings(commentMap);
    }

    @Override
    public Optional<String> createArticle(ArticleDTO articleDTO, Principal principalUser) {
        Article article = modelMapper.map(articleDTO, Article.class);

        if (principalUser.getName().contains("@")) {
            authenticationRepository.findByEmail(principalUser.getName()).ifPresent(article::setOwner);
        } else {
            authenticationRepository.findByUsername(principalUser.getName()).ifPresent(article::setOwner);
        }

        articleRepository.save(article);
        return Optional.of("Article created!");
    }

    @Override
    public ResponseEntity<ArticleDTO> getArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Article not found"));

                return ResponseEntity.ok(modelMapper.map(article, ArticleDTO.class));
            }

    @Override
    public List<ArticleDTO> getArticles() {
        List<Article> articles = StreamSupport.stream(articleRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());

        if (articles.isEmpty()) throw new NotFoundException("No articles found");

        return articles.stream()
                .map(article -> modelMapper.map(article, ArticleDTO.class))
                .collect(Collectors.toList());
    }
}