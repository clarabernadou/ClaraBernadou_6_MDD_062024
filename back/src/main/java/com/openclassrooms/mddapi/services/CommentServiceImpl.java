package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.controllers.advice.exceptions.NotFoundException;
import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.entity.Comment;
import com.openclassrooms.mddapi.repository.ArticleRepository;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.services.interfaces.CommentService;

/**
 * Service implementation for managing comments
 * This class implements {@link CommentService} interface and provides
 * functionality for creating and retrieving comments associated with articles
 */
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final AuthenticationRepository authenticationRepository;
    private final ArticleRepository articleRepository;
    private final ModelMapper modelMapper;

    /**
     * Constructs new CommentServiceImpl with specified dependencies
     *
     * @param commentRepository repository for handling comment-related operations
     * @param authenticationRepository repository for handling authentication-related operations
     * @param articleRepository repository for handling article-related operations
     * @param modelMapper model mapper for converting between DTOs and entities
     */
    public CommentServiceImpl(CommentRepository commentRepository, AuthenticationRepository authenticationRepository, ArticleRepository articleRepository, ModelMapper modelMapper) {
        this.commentRepository = commentRepository;
        this.authenticationRepository = authenticationRepository;
        this.articleRepository = articleRepository;
        this.modelMapper = modelMapper;

        // Configures mapping between CommentDTO and Comment entities
        PropertyMap<CommentDTO, Comment> commentMap = new PropertyMap<CommentDTO, Comment>() {
            @Override
            protected void configure() {
                map().setId(source.getUserId());
            }
        };

        this.modelMapper.addMappings(commentMap);
    }

    /**
     * Retrieves all comments
     *
     * @return list of CommentDTOs representing all comments
     * @throws NotFoundException if no comments are found
     */
    @Override
    public List<CommentDTO> getComments() {
        List<Comment> comments = StreamSupport.stream(commentRepository.findAll().spliterator(), false)
                                        .collect(Collectors.toList());

        if (comments.isEmpty()) throw new NotFoundException("No comments found");

        return comments.stream()
                    .map(comment -> modelMapper.map(comment, CommentDTO.class))
                    .collect(Collectors.toList());
    }

    /**
     * Creates new comment associated with specified article
     *
     * @param commentDTO DTO containing comment data
     * @param articleId ID of article to which comment is associated
     * @param principalUser currently authenticated user
     * @return Optional containing success message if comment is created
     */
    @Override
    public Optional<String> createComment(CommentDTO commentDTO, Long articleId, Principal principalUser) {
        Comment comment = modelMapper.map(commentDTO, Comment.class);

        if (principalUser.getName().contains("@")) {
            authenticationRepository.findByEmail(principalUser.getName()).ifPresent(comment::setUserId);
        } else {
            authenticationRepository.findByUsername(principalUser.getName()).ifPresent(comment::setUserId);
        }

        articleRepository.findById(articleId).ifPresent(comment::setArticleId);

        commentRepository.save(comment);
        return Optional.of("Comment created!");
    }
}
