package com.cmc.fashion_store.controller;

import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}