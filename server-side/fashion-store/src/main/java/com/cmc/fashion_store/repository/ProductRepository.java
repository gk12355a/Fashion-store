package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA sẽ tự động cung cấp cho chúng ta hàm `findAll()` để lấy tất cả sản phẩm.
    // Vì vậy, ở bước này chúng ta không cần viết thêm gì cả.
    /**
     * Tìm kiếm sản phẩm. Các tham số có thể là null.
     * Tên phương thức này sẽ được Spring Data JPA dịch thành câu lệnh SQL tương ứng.
     * 'Containing' tương đương với mệnh đề LIKE '%...%'.
     * 'IgnoreCase' để không phân biệt chữ hoa, chữ thường.
     *
     * @param name Tên sản phẩm
     * @param type Loại sản phẩm
     * @param size Kích cỡ
     * @param color Màu sắc
     * @return Danh sách sản phẩm phù hợp
     */
    List<Product> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrSizeContainingIgnoreCaseOrColorContainingIgnoreCase(
            String name, String type, String size, String color
    );
}