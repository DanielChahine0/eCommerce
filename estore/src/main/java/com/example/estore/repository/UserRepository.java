package com.example.estore.repository;

import com.example.estore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findByRole(String role);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.id <> :userId")
    Optional<User> findByEmailAndIdNot(@Param("email") String email, @Param("userId") Integer userId);
}
