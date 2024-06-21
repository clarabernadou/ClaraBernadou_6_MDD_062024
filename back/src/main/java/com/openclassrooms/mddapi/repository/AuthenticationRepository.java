package com.openclassrooms.mddapi.repository;

import com.openclassrooms.mddapi.entity.Auth;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenticationRepository extends CrudRepository<Auth, Long> {
    Optional<Auth> findByEmail(String email);
    Optional<Auth> findByUsername(String username);
    Optional<Auth> findById(Long id);
}
