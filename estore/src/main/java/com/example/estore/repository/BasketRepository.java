package com.example.estore.repository;

import com.example.estore.model.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BasketRepository extends JpaRepository<Basket, Integer> {
    List<Basket> findByUserId(Integer userId);

    Optional<Basket> findByUserIdAndProductId(Integer userId, Integer productId);

    @Modifying
    @Query("DELETE FROM Basket b WHERE b.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("DELETE FROM Basket b WHERE b.user.id = :userId AND b.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Integer userId, @Param("productId") Integer productId);

    @Query("SELECT COUNT(b) FROM Basket b WHERE b.user.id = :userId")
    long countByUserId(@Param("userId") Integer userId);
}
