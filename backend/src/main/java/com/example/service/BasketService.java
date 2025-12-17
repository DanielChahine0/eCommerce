package com.example.service;

import com.example.dto.AddToBasketRequest;
import com.example.dto.BasketItemDTO;
import com.example.exception.InsufficientStockException;
import com.example.exception.InvalidOperationException;
import com.example.exception.ResourceNotFoundException;
import com.example.model.Basket;
import com.example.model.Product;
import com.example.model.User;
import com.example.repository.BasketRepository;
import com.example.repository.ProductRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BasketService {
    
    @Autowired
    private BasketRepository basketRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public BasketItemDTO addToBasket(AddToBasketRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: '" + request.getUserId() + "'"));
        
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found with id: '" + request.getProductId() + "'"));
        
        if (request.getQuantity() <= 0) {
            throw new InvalidOperationException("Quantity must be greater than 0");
        }
        
        // Check stock availability
        if (product.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(
                "Insufficient stock for product '" + product.getName() + 
                "'. Available: " + product.getQuantity() + 
                ", Requested: " + request.getQuantity());
        }
        
        // Check if product is already in user's basket
        Optional<Basket> existingBasket = basketRepository
            .findByUserIdAndProductId(request.getUserId(), request.getProductId());
        
        Basket basket;
        if (existingBasket.isPresent()) {
            // Update existing basket item
            basket = existingBasket.get();
            int newQuantity = basket.getQuantity() + request.getQuantity();
            
            // Check stock for new total quantity
            if (product.getQuantity() < newQuantity) {
                throw new InsufficientStockException(
                    "Insufficient stock for product '" + product.getName() + 
                    "'. Available: " + product.getQuantity() + 
                    ", Requested total: " + newQuantity);
            }
            
            basket.setQuantity(newQuantity);
        } else {
            // Create new basket item
            basket = new Basket(user, product, request.getQuantity());
        }
        
        Basket savedBasket = basketRepository.save(basket);
        return convertToDTO(savedBasket);
    }
    
    public List<BasketItemDTO> getUserBasket(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                "User not found with id: '" + userId + "'");
        }
        
        return basketRepository.findByUserId(userId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public long getBasketItemCount(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                "User not found with id: '" + userId + "'");
        }
        return basketRepository.countByUserId(userId);
    }
    
    public BasketItemDTO updateBasketItemQuantity(Long basketItemId, Integer quantity) {
        Basket basket = basketRepository.findById(basketItemId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Basket item not found with id: '" + basketItemId + "'"));
        
        if (quantity <= 0) {
            throw new InvalidOperationException("Quantity must be greater than 0");
        }
        
        // Check stock availability
        Product product = basket.getProduct();
        if (product.getQuantity() < quantity) {
            throw new InsufficientStockException(
                "Insufficient stock for product '" + product.getName() + 
                "'. Available: " + product.getQuantity() + 
                ", Requested: " + quantity);
        }
        
        basket.setQuantity(quantity);
        Basket updatedBasket = basketRepository.save(basket);
        return convertToDTO(updatedBasket);
    }
    
    public void removeBasketItem(Long basketItemId) {
        if (!basketRepository.existsById(basketItemId)) {
            throw new ResourceNotFoundException(
                "Basket item not found with id: '" + basketItemId + "'");
        }
        basketRepository.deleteById(basketItemId);
    }
    
    public void clearUserBasket(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                "User not found with id: '" + userId + "'");
        }
        basketRepository.deleteByUserId(userId);
    }
    
    private BasketItemDTO convertToDTO(Basket basket) {
        return new BasketItemDTO(
            basket.getId(),
            basket.getUser().getId(),
            basket.getProduct().getId(),
            basket.getProduct().getName(),
            basket.getQuantity(),
            basket.getProduct().getQuantity()
        );
    }
}
