package com.example.estore.repository;

import com.example.estore.model.Jewelry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JewelryRepository extends JpaRepository<Jewelry, Integer> {
    List<Jewelry> findByColor(String color);
}
