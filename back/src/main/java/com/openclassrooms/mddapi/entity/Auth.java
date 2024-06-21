package com.openclassrooms.mddapi.entity;

import lombok.Data;
import org.jetbrains.annotations.NotNull;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "users")
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @NotNull
    @Column(unique = true)
    private String username;

    @NotNull
    private String password;

//    @ManyToMany
//    @JoinTable(name = "user_subscriptions", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "theme_id"))
//    private List<Theme> subscriptions;

    @Column(updatable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
        updatedAt = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDate.now();
    }

    public Auth() {}
}
