package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateProductRequest; // Import DTO mới
import com.cmc.fashion_store.dto.UpdateProductRequest; // Import DTO mới
import com.cmc.fashion_store.model.Product;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    /**
     * Lấy danh sách tất cả sản phẩm có phân trang.
     * @param pageable đối tượng chứa thông tin phân trang (số trang, kích thước trang).
     * @return một trang (Page) chứa danh sách Product và thông tin phân trang.
     */
    Page<Product> getAllProducts(Pageable pageable);
    /**
     * Tạo một sản phẩm mới dựa trên thông tin yêu cầu và file ảnh.
     * @param request đối tượng chứa thông tin sản phẩm mới.
     * @param file file ảnh tải lên.
     * @return Product đã được tạo và lưu trong DB.
     */
    Product createProduct(CreateProductRequest request, MultipartFile file);
    /**
     * Xóa một sản phẩm dựa vào ID.
     * @param id ID của sản phẩm cần xóa.
     */
    void deleteProduct(Long id);
    /**
     * Tìm kiếm sản phẩm dựa trên các tiêu chí.
     * @param query Từ khóa tìm kiếm chung.
     * @return Danh sách sản phẩm phù hợp.
     */
    List<Product> searchProducts(String query);
    /**
     * Cập nhật thông tin một sản phẩm đã có.
     * @param id ID của sản phẩm cần cập nhật.
     * @param request Đối tượng chứa thông tin mới.
     * @param file file ảnh mới (có thể null nếu không cập nhật).
     * @return Product đã được cập nhật.
     */
    Product updateProduct(Long id, UpdateProductRequest request, MultipartFile file);
}