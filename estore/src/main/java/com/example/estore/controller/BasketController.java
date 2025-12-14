package com.example.estore.controller;

import com.example.estore.dto.AddToBasketRequest;
import com.example.estore.dto.BasketItemDTO;
import com.example.estore.service.BasketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/basket")
public class BasketController {

    private final BasketService basketService;

    @Autowired
    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }

    @PostMapping
    public ResponseEntity<BasketItemDTO> addToBasket(@Valid @RequestBody AddToBasketRequest request) {
        BasketItemDTO basketItem = basketService.addToBasket(request);
        return new ResponseEntity<>(basketItem, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BasketItemDTO>> getBasketItems(@PathVariable Integer userId) {
        List<BasketItemDTO> items = basketService.getBasketItems(userId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getBasketItemCount(@PathVariable Integer userId) {
        long count = basketService.getBasketItemCount(userId);
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{basketItemId}")
    public ResponseEntity<BasketItemDTO> updateBasketItemQuantity(
            @PathVariable Integer basketItemId,
            @RequestParam Integer quantity) {
        BasketItemDTO basketItem = basketService.updateBasketItemQuantity(basketItemId, quantity);
        return ResponseEntity.ok(basketItem);
    }

    @DeleteMapping("/{basketItemId}")
    public ResponseEntity<Void> removeFromBasket(@PathVariable Integer basketItemId) {
        basketService.removeFromBasket(basketItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearBasket(@PathVariable Integer userId) {
        basketService.clearBasket(userId);
        return ResponseEntity.noContent().build();
    }
}
