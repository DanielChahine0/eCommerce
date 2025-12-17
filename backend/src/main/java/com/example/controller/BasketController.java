package com.example.controller;

import com.example.dto.AddToBasketRequest;
import com.example.dto.BasketItemDTO;
import com.example.service.BasketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/basket")
public class BasketController {
    
    @Autowired
    private BasketService basketService;
    
    @PostMapping
    public ResponseEntity<BasketItemDTO> addToBasket(@Valid @RequestBody AddToBasketRequest request) {
        BasketItemDTO basketItem = basketService.addToBasket(request);
        return new ResponseEntity<>(basketItem, HttpStatus.CREATED);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BasketItemDTO>> getUserBasket(@PathVariable Long userId) {
        List<BasketItemDTO> basket = basketService.getUserBasket(userId);
        return ResponseEntity.ok(basket);
    }
    
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getBasketItemCount(@PathVariable Long userId) {
        long count = basketService.getBasketItemCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @PatchMapping("/{basketItemId}")
    public ResponseEntity<BasketItemDTO> updateBasketItemQuantity(
            @PathVariable Long basketItemId,
            @RequestParam Integer quantity) {
        BasketItemDTO basketItem = basketService.updateBasketItemQuantity(basketItemId, quantity);
        return ResponseEntity.ok(basketItem);
    }
    
    @DeleteMapping("/{basketItemId}")
    public ResponseEntity<Void> removeBasketItem(@PathVariable Long basketItemId) {
        basketService.removeBasketItem(basketItemId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearUserBasket(@PathVariable Long userId) {
        basketService.clearUserBasket(userId);
        return ResponseEntity.noContent().build();
    }
}
