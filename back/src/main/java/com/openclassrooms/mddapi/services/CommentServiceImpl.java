package com.openclassrooms.mddapi.services;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.CommentDTO;
import com.openclassrooms.mddapi.entity.Comment;
import com.openclassrooms.mddapi.repository.CommentRepository;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final ModelMapper modelMapper;

    public CommentServiceImpl(CommentRepository commentRepository, ModelMapper modelMapper) {
        this.commentRepository = commentRepository;
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
    public Optional<String> createComment(CommentDTO commentDTO) {
        Comment comment = modelMapper.map(commentDTO, Comment.class);
        commentRepository.save(comment);
        return Optional.of("Comment created !");
    }
}
