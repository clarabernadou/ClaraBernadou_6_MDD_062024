package com.openclassrooms.mddapi.entity;

import java.time.LocalDate;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Auth userId;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article articleId;

    @Column(updatable = false, name = "created_at")
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}