package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateProductRequest; // Import DTO
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.service.ProductService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/products") // Sử dụng prefix /api/v1 từ file properties
public class ProductController {

    @Autowired
    private ProductService productService;

    // API này sẽ xử lý yêu cầu GET đến /api/v1/products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products); // Trả về danh sách sản phẩm với status 200 OK
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/products
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Product createdProduct = productService.createProduct(request);
        // Trả về sản phẩm vừa tạo với status 201 CREATED
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    // API này sẽ xử lý yêu cầu DELETE đến /api/v1/products/{id}
    // Ví dụ: /api/v1/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công và không có body trả về.
        return ResponseEntity.noContent().build();
    }
    
}