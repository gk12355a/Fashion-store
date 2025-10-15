package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateProductRequest;
import com.cmc.fashion_store.model.Product;
import java.util.List;

public interface ProductService {
    /**
     * Lấy danh sách tất cả sản phẩm.
     * @return danh sách Product.
     */
    List<Product> getAllProducts();
    /**
     * Tạo một sản phẩm mới dựa trên thông tin yêu cầu.
     * @param request đối tượng chứa thông tin sản phẩm mới.
     * @return Product đã được tạo và lưu trong DB.
     */
    Product createProduct(CreateProductRequest request);
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
}