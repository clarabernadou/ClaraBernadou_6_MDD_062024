package com.openclassrooms.mddapi.services;

import java.security.Principal;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.entity.Comment;
import com.openclassrooms.mddapi.repository.AuthenticationRepository;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.services.interfaces.CommentService;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final AuthenticationRepository authenticationRepository;

    private final ModelMapper modelMapper;

    public CommentServiceImpl(CommentRepository commentRepository, AuthenticationRepository authenticationRepository, ModelMapper modelMapper) {
        this.commentRepository = commentRepository;
        this.authenticationRepository = authenticationRepository;
        this.modelMapper = modelMapper;

        PropertyMap<CommentDTO, Comment> commentMap = new PropertyMap<CommentDTO, Comment>() {
            @Override
            protected void configure() {
                map().setId(source.getUserId());
            }
        };
        this.modelMapper.addMappings(commentMap);
    }

    @Override
    public Optional<String> createComment(CommentDTO commentDTO, Principal principalUser) {
        Comment comment = modelMapper.map(commentDTO, Comment.class);

        if (principalUser.getName().contains("@")) {
            authenticationRepository.findByEmail(principalUser.getName()).ifPresent(comment::setUser);
        } else {
            authenticationRepository.findByUsername(principalUser.getName()).ifPresent(comment::setUser);
        }

        commentRepository.save(comment);
        return Optional.of("Comment created !");
    }
}
