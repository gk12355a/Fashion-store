package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateProductRequest;
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.ProductService;
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


}