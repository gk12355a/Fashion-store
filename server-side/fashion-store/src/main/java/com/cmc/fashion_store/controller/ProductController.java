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
import org.springframework.web.multipart.MultipartFile;
import org.springdoc.core.annotations.ParameterObject; // <-- THÊM IMPORT NÀY
import org.springframework.http.MediaType; // <-- THÊM IMPORT NÀY
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
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // 1. Thay đổi consumes
    public ResponseEntity<Product> createProduct(
            @Valid @RequestPart("product") CreateProductRequest request, // 2. Dùng @RequestPart cho JSON
            @RequestPart("file") MultipartFile file                     // 3. Dùng @RequestPart cho File
    ) {
        Product createdProduct = productService.createProduct(request, file);
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
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // 1. Thay đổi consumes
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") UpdateProductRequest request,         // 2. Dùng @RequestPart cho JSON
            @RequestPart(value = "file", required = false) MultipartFile file  // 3. Dùng @RequestPart (optional)
    ) {
        Product updatedProduct = productService.updateProduct(id, request, file);
        return ResponseEntity.ok(updatedProduct);
    }
    // --- THÊM ENDPOINT MỚI CHO AUTOCOMPLETE ---
    /**
     * API lấy gợi ý (autocomplete) cho tên sản phẩm
     * Ví dụ: GET /api/v1/products/autocomplete?q=áo
     *
     * @param query Từ khóa tìm kiếm (lấy từ param 'q')
     * @return ResponseEntity chứa List<String>
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> getAutocompleteSuggestions(@RequestParam("q") String query) {
        List<String> suggestions = productService.getAutocompleteSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}