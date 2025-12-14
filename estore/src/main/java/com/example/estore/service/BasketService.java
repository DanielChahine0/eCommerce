package com.example.estore.service;

import com.example.estore.dto.AddToBasketRequest;
import com.example.estore.dto.BasketItemDTO;
import com.example.estore.dto.ProductDTO;
import com.example.estore.exception.InsufficientStockException;
import com.example.estore.exception.InvalidOperationException;
import com.example.estore.exception.ResourceNotFoundException;
import com.example.estore.model.Basket;
import com.example.estore.model.Product;
import com.example.estore.model.User;
import com.example.estore.repository.BasketRepository;
import com.example.estore.repository.ProductRepository;
import com.example.estore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BasketService {

    private final BasketRepository basketRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public BasketService(BasketRepository basketRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.basketRepository = basketRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public BasketItemDTO addToBasket(AddToBasketRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        // Validate product exists
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        // Validate quantity
        if (request.getQuantity() <= 0) {
            throw new InvalidOperationException("Quantity must be greater than zero");
        }

        // Validate stock availability
        if (product.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(product.getName(), product.getQuantity(), request.getQuantity());
        }

        // Check if product already in basket
        Optional<Basket> existingBasketItem = basketRepository.findByUserIdAndProductId(
                request.getUserId(), request.getProductId());

        Basket basket;
        if (existingBasketItem.isPresent()) {
            // Update quantity
            basket = existingBasketItem.get();
            int newQuantity = basket.getQuantity() + request.getQuantity();

            // Validate total quantity against stock
            if (product.getQuantity() < newQuantity) {
                throw new InsufficientStockException(product.getName(), product.getQuantity(), newQuantity);
            }

            basket.setQuantity(newQuantity);
        } else {
            // Create new basket item
            basket = new Basket(user, product, request.getQuantity());
        }

        basket = basketRepository.save(basket);
        return convertToDTO(basket);
    }

    public List<BasketItemDTO> getBasketItems(Integer userId) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return basketRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BasketItemDTO updateBasketItemQuantity(Integer basketItemId, Integer quantity) {
        // Validate basket item exists
        Basket basket = basketRepository.findById(basketItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Basket item", "id", basketItemId));

        // Validate quantity
        if (quantity <= 0) {
            throw new InvalidOperationException("Quantity must be greater than zero");
        }

        // Validate stock availability
        Product product = basket.getProduct();
        if (product.getQuantity() < quantity) {
            throw new InsufficientStockException(product.getName(), product.getQuantity(), quantity);
        }

        basket.setQuantity(quantity);
        basket = basketRepository.save(basket);
        return convertToDTO(basket);
    }

    public void removeFromBasket(Integer basketItemId) {
        Basket basket = basketRepository.findById(basketItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Basket item", "id", basketItemId));
        basketRepository.delete(basket);
    }

    public void clearBasket(Integer userId) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        basketRepository.deleteByUserId(userId);
    }

    public long getBasketItemCount(Integer userId) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return basketRepository.countByUserId(userId);
    }

    private BasketItemDTO convertToDTO(Basket basket) {
        Product product = basket.getProduct();
        ProductDTO productDTO = new ProductDTO(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getDescription(),
                product.getImage(),
                product.getBrand().getId(),
                product.getBrand().getName(),
                product.getCategory().getId(),
                product.getCategory().getName());

        return new BasketItemDTO(
                basket.getId(),
                productDTO,
                basket.getQuantity());
    }
}
