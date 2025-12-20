package com.example.service;

import com.example.dto.CreateProductRequest;
import com.example.dto.ProductDTO;
import com.example.exception.InvalidOperationException;
import com.example.exception.ResourceNotFoundException;
import com.example.model.Brand;
import com.example.model.Category;
import com.example.model.Product;
import com.example.repository.BrandRepository;
import com.example.repository.CategoryRepository;
import com.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public ProductDTO createProduct(CreateProductRequest request) {
        if (request.getQuantity() < 0) {
            throw new InvalidOperationException("Product quantity cannot be negative");
        }
        
        Brand brand = brandRepository.findById(request.getBrandId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Brand not found with id: '" + request.getBrandId() + "'"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Category not found with id: '" + request.getCategoryId() + "'"));
        
        Product product = new Product(
            request.getName(),
            request.getQuantity(),
            request.getPrice(),
            request.getDescription(),
            request.getImage(),
            brand,
            category
        );
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }
    
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found with id: '" + id + "'"));
        return convertToDTO(product);
    }
    
    public List<ProductDTO> getAllProducts(boolean availableOnly) {
        List<Product> products;
        if (availableOnly) {
            products = productRepository.findAvailableProducts();
        } else {
            products = productRepository.findAll();
        }
        return products.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getProductsByBrand(Long brandId) {
        if (!brandRepository.existsById(brandId)) {
            throw new ResourceNotFoundException(
                "Brand not found with id: '" + brandId + "'");
        }
        return productRepository.findByBrandId(brandId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException(
                "Category not found with id: '" + categoryId + "'");
        }
        return productRepository.findByCategoryId(categoryId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProductDTO> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ProductDTO> filterProducts(Long brandId, Long categoryId) {
        if (brandId != null && categoryId != null) {
            return productRepository.findByBrandIdAndCategoryId(brandId, categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        } else if (brandId != null) {
            return getProductsByBrand(brandId);
        } else if (categoryId != null) {
            return getProductsByCategory(categoryId);
        } else {
            return getAllProducts(false);
        }
    }
    
    public ProductDTO updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found with id: '" + id + "'"));
        
        if (request.getQuantity() < 0) {
            throw new InvalidOperationException("Product quantity cannot be negative");
        }
        
        Brand brand = brandRepository.findById(request.getBrandId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Brand not found with id: '" + request.getBrandId() + "'"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Category not found with id: '" + request.getCategoryId() + "'"));
        
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());
        product.setBrand(brand);
        product.setCategory(category);
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    public ProductDTO updateProductQuantity(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found with id: '" + id + "'"));
        
        if (quantity < 0) {
            throw new InvalidOperationException("Product quantity cannot be negative");
        }
        
        product.setQuantity(quantity);
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                "Product not found with id: '" + id + "'");
        }
        productRepository.deleteById(id);
    }
    
    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
            product.getId(),
            product.getName(),
            product.getQuantity(),
            product.getPrice(),
            product.getDescription(),
            product.getImage(),
            product.getBrand().getName(),
            product.getBrand().getId(),
            product.getCategory().getName(),
            product.getCategory().getId()
        );
    }
}
