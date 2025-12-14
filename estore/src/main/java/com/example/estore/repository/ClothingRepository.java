package com.example.estore.repository;

import com.example.estore.model.Clothing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClothingRepository extends JpaRepository<Clothing, Integer> {
    List<Clothing> findBySize(String size);

    List<Clothing> findByColor(String color);

    List<Clothing> findBySizeAndColor(String size, String color);
}
