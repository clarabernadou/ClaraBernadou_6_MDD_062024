package com.openclassrooms.mddapi.repository;

import java.util.*;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.entity.Comment;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long>{
    Optional<Comment> findById(Long id);
    List<Comment> findAll();
}
