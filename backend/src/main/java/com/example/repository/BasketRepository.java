package com.example.repository;

import com.example.model.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BasketRepository extends JpaRepository<Basket, Long> {
    List<Basket> findByUserId(Long userId);
    Optional<Basket> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserId(Long userId);
    long countByUserId(Long userId);
}
