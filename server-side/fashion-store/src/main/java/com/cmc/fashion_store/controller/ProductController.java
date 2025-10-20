package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.dto.CreateProductRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateProductRequest;
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.service.ProductService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springdoc.core.annotations.ParameterObject; // <-- THÊM IMPORT NÀY
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/products") // Sử dụng prefix /api/v1 từ file properties
public class ProductController {

    @Autowired
    private ProductService productService;

    // API này giờ sẽ nhận các tham số như page, size
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(@ParameterObject Pageable pageable) {
        Page<Product> productsPage = productService.getAllProducts(pageable);
        return ResponseEntity.ok(productsPage);
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
    // Ví dụ: /api/v1/products/12
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        // Trả về status 204 No Content, báo hiệu xóa thành công và không có body trả về.
        return ResponseEntity.noContent().build();
    }
    // API này sẽ xử lý yêu cầu GET đến /api/v1/products/search
    // Ví dụ: /api/v1/products/search?q=áo
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(name = "q") String query) {
        List<Product> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }
    // API này sẽ xử lý yêu cầu PUT đến /api/v1/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) {
        Product updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(updatedProduct); // Trả về sản phẩm đã cập nhật và status 200 OK
    }
    
}