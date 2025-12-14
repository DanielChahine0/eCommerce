package com.example.estore.repository;

import com.example.estore.model.Order;
import com.example.estore.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Integer userId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByUserIdAndStatus(Integer userId, OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.timeCreated BETWEEN :startDate AND :endDate")
    List<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    List<Order> findByUserIdOrderByTimeCreatedDesc(Integer userId);
}
