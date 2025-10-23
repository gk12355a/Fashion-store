package com.cmc.fashion_store.repository;

import com.cmc.fashion_store.dto.CategoryCountDto;
import com.cmc.fashion_store.model.Product;
import org.springframework.data.domain.Pageable; // <-- THÊM IMPORT NÀY
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- THÊM IMPORT NÀY
import org.springframework.data.repository.query.Param; // <-- THÊM IMPORT NÀY
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Data JPA sẽ tự động cung cấp cho chúng ta hàm `findAll()` để lấy tất
    // cả sản phẩm.
    // Vì vậy, ở bước này chúng ta không cần viết thêm gì cả.
    /**
     * Tìm kiếm sản phẩm. Các tham số có thể là null.
     * Tên phương thức này sẽ được Spring Data JPA dịch thành câu lệnh SQL tương
     * ứng.
     * 'Containing' tương đương với mệnh đề LIKE '%...%'.
     * 'IgnoreCase' để không phân biệt chữ hoa, chữ thường.
     *
     * @param name  Tên sản phẩm
     * @param type  Loại sản phẩm
     * @param size  Kích cỡ
     * @param color Màu sắc
     * @return Danh sách sản phẩm phù hợp
     */
    List<Product> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCaseOrSizeContainingIgnoreCaseOrColorContainingIgnoreCase(
            String name, String type, String size, String color);

    // --- THÊM PHƯƠNG THỨC MỚI CHO AUTOCOMPLETE ---
    /**
     * Tìm kiếm tên sản phẩm (phân biệt chữ thường) để gợi ý.
     * Chỉ chọn (SELECT) cột 'name' và đảm bảo tên là duy nhất (DISTINCT).
     * Sử dụng Pageable để giới hạn số lượng gợi ý (ví dụ: 10).
     *
     * @param query    Từ khóa tìm kiếm (ví dụ: "áo")
     * @param pageable Đối tượng phân trang (ví dụ: PageRequest.of(0, 10))
     * @return Danh sách các tên sản phẩm (List<String>)
     */
    @Query("SELECT DISTINCT p.name FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<String> findSuggestionsByName(@Param("query") String query, Pageable pageable);

    // --- ADD THIS METHOD for Category Chart ---
    /**
     * Counts products grouped by their type (category).
     * 
     * @return A list of CategoryCountDto, each containing a type and its count.
     */
    @Query("SELECT new com.cmc.fashion_store.dto.CategoryCountDto(p.type, COUNT(p.id)) " +
            "FROM Product p " +
            "WHERE p.type IS NOT NULL AND p.type <> '' " + // Optional: Exclude products without a type
            "GROUP BY p.type " +
            "ORDER BY COUNT(p.id) DESC") // Order by count descending (most popular first)
    List<CategoryCountDto> findProductCountByCategory();
    // ------------------------------------------
}