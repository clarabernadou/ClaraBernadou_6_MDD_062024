package com.openclassrooms.mddapi.entity;

import java.time.LocalDate;
import java.util.Set;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "theme_id")
    private Theme theme;

    private String title;

    private String content;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Auth owner;

    @OneToMany(mappedBy = "articleId")
    private Set<Comment> articleComments;

    @Column(updatable = false, name = "created_at")
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}