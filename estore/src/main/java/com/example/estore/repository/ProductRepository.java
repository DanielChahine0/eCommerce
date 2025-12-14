package com.example.estore.repository;

import com.example.estore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByBrandId(Integer brandId);

    List<Product> findByCategoryId(Integer categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE p.quantity > 0")
    List<Product> findAvailableProducts();

    @Query("SELECT p FROM Product p WHERE p.brand.id = :brandId AND p.category.id = :categoryId")
    List<Product> findByBrandIdAndCategoryId(@Param("brandId") Integer brandId,
            @Param("categoryId") Integer categoryId);

    List<Product> findByQuantityGreaterThan(Integer quantity);
}
