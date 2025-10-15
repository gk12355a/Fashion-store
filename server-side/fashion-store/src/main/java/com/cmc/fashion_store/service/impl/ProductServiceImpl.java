package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateProductRequest;
import com.cmc.fashion_store.dto.UpdateProductRequest; // Import DTO mới
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.ProductService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @Override
    public Product createProduct(CreateProductRequest request) {
        // Chuyển đổi từ DTO (dữ liệu đầu vào) sang Entity (đối tượng lưu vào DB)
        Product newProduct = new Product();
        newProduct.setName(request.getName());
        newProduct.setImageUrl(request.getImageUrl());
        newProduct.setType(request.getType());
        newProduct.setSize(request.getSize());
        newProduct.setColor(request.getColor());
        newProduct.setPrice(request.getPrice());
        newProduct.setStockQuantity(request.getStockQuantity());

        // Dùng hàm save của JpaRepository để lưu vào DB
        return productRepository.save(newProduct);
    }
    @Override
    public void deleteProduct(Long id) {
        // Kiểm tra xem sản phẩm có tồn tại không trước khi xóa
        if (!productRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi rõ ràng
            throw new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepository.deleteById(id);
    }
    @Override
    public List<Product> searchProducts(String query) {
        // Truyền cùng một query cho tất cả các tham số của phương thức trong repository
        return productRepository.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrSizeContainingIgnoreCaseOrColorContainingIgnoreCase(
                query, query, query, query
        );
    }
    @Override
    public Product updateProduct(Long id, UpdateProductRequest request) {
        // 1. Tìm sản phẩm trong DB bằng ID. Nếu không thấy, ném ra lỗi.
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // 2. Cập nhật các trường của sản phẩm đã tìm thấy với dữ liệu từ request
        existingProduct.setName(request.getName());
        existingProduct.setImageUrl(request.getImageUrl());
        existingProduct.setType(request.getType());
        existingProduct.setSize(request.getSize());
        existingProduct.setColor(request.getColor());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStockQuantity(request.getStockQuantity());

        // 3. Lưu lại sản phẩm đã được cập nhật vào DB
        return productRepository.save(existingProduct);
    }


}