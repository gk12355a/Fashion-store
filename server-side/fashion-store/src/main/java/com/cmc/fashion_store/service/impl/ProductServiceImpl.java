package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreateProductRequest;
import com.cmc.fashion_store.dto.UpdateProductRequest; // Import DTO mới
import com.cmc.fashion_store.model.Product;
import com.cmc.fashion_store.repository.ProductRepository;
import com.cmc.fashion_store.service.IStorageService;
import com.cmc.fashion_store.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private IStorageService storageService;

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        // Chỉ cần gọi hàm findAll có sẵn của JpaRepository với tham số pageable
        return productRepository.findAll(pageable);
    }
    @Override
    public Product createProduct(CreateProductRequest request, MultipartFile file) {
        // 1. Tải ảnh lên Cloudinary
        String imageUrl = storageService.storeFile(file);

        // 2. Chuyển đổi từ DTO sang Entity
        Product newProduct = new Product();
        newProduct.setName(request.getName());
        newProduct.setImageUrl(imageUrl); // <-- SỬ DỤNG LINK TỪ CLOUDINARY
        newProduct.setType(request.getType());
        newProduct.setSize(request.getSize());
        newProduct.setColor(request.getColor());
        newProduct.setPrice(request.getPrice());
        newProduct.setStockQuantity(request.getStockQuantity());

        // 3. Dùng hàm save của JpaRepository để lưu vào DB
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
    public Product updateProduct(Long id, UpdateProductRequest request, MultipartFile file) {
        // 1. Tìm sản phẩm trong DB bằng ID.
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        // 2. Cập nhật các trường thông tin (trừ ảnh)
        existingProduct.setName(request.getName());
        existingProduct.setType(request.getType());
        existingProduct.setSize(request.getSize());
        existingProduct.setColor(request.getColor());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStockQuantity(request.getStockQuantity());

        // 3. Kiểm tra xem có file ảnh mới không
        if (file != null && !file.isEmpty()) {
            // (Nên thêm logic xóa ảnh cũ trên Cloudinary ở đây nếu cần)
            
            // 3.1. Tải ảnh mới lên
            String newImageUrl = storageService.storeFile(file);
            // 3.2. Cập nhật link ảnh mới
            existingProduct.setImageUrl(newImageUrl);
        }

        // 4. Lưu lại sản phẩm đã được cập nhật vào DB
        return productRepository.save(existingProduct);
    }

    // --- IMPLEMENT PHƯƠNG THỨC MỚI ---
    @Override
    public List<String> getAutocompleteSuggestions(String query) {
        // Tạo Pageable để giới hạn 10 kết quả (trang 0, 10 item)
        Pageable limit = PageRequest.of(0, 10);
        return productRepository.findSuggestionsByName(query, limit);
    }


}