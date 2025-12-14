package com.example.estore.service;

import com.example.estore.dto.CreateProductRequest;
import com.example.estore.dto.ProductDTO;
import com.example.estore.exception.InvalidOperationException;
import com.example.estore.exception.ResourceNotFoundException;
import com.example.estore.model.Brand;
import com.example.estore.model.Category;
import com.example.estore.model.Product;
import com.example.estore.repository.BrandRepository;
import com.example.estore.repository.CategoryRepository;
import com.example.estore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductService(ProductRepository productRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    public ProductDTO createProduct(CreateProductRequest request) {
        // Validate quantity
        if (request.getQuantity() < 0) {
            throw new InvalidOperationException("Product quantity cannot be negative");
        }

        // Fetch brand
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getBrandId()));

        // Fetch category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        // Create product
        Product product = new Product(
                request.getName(),
                request.getQuantity(),
                request.getDescription(),
                request.getImage(),
                brand,
                category);

        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return convertToDTO(product);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getAvailableProducts() {
        return productRepository.findAvailableProducts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByBrand(Integer brandId) {
        // Verify brand exists
        if (!brandRepository.existsById(brandId)) {
            throw new ResourceNotFoundException("Brand", "id", brandId);
        }
        return productRepository.findByBrandId(brandId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategory(Integer categoryId) {
        // Verify category exists
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByBrandAndCategory(Integer brandId, Integer categoryId) {
        // Verify brand exists
        if (!brandRepository.existsById(brandId)) {
            throw new ResourceNotFoundException("Brand", "id", brandId);
        }
        // Verify category exists
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        return productRepository.findByBrandIdAndCategoryId(brandId, categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO updateProduct(Integer id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // Validate quantity
        if (request.getQuantity() < 0) {
            throw new InvalidOperationException("Product quantity cannot be negative");
        }

        // Fetch brand
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", request.getBrandId()));

        // Fetch category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        // Update product
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());
        product.setBrand(brand);
        product.setCategory(category);

        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public ProductDTO updateProductQuantity(Integer id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (quantity < 0) {
            throw new InvalidOperationException("Product quantity cannot be negative");
        }

        product.setQuantity(quantity);
        product = productRepository.save(product);
        return convertToDTO(product);
    }

    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getDescription(),
                product.getImage(),
                product.getBrand().getId(),
                product.getBrand().getName(),
                product.getCategory().getId(),
                product.getCategory().getName());
    }
}
