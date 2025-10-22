package com.cmc.fashion_store.repository;
import com.cmc.fashion_store.model.Staff;

import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List; 
@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    // Spring Data JPA sẽ tự động cung cấp cho chúng ta hàm `findAll()` để lấy tất cả nhân viên.
    // Vì vậy, ở bước này chúng ta không cần viết thêm gì cả.
    /**
     * Tìm kiếm nhân viên dựa trên tên và chức vụ..
     * Tên phương thức này sẽ được Spring Data JPA dịch thành câu lệnh SQL tương ứng.
     * 'Containing' tương đương với mệnh đề LIKE '%...%'.
     * 'IgnoreCase' để không phân biệt chữ hoa, chữ thường.
     *
     * @param name Tên nhân viên
     * @param position Chức vụ
     * @return Danh sách nhân viên phù hợp
     */
    List<Staff> findByNameContainingIgnoreCaseOrPositionContainingIgnoreCase(String name, String position);
    // --- PHƯƠNG THỨC MỚI CHO AUTOCOMPLETE ---
    /**
     * Tìm gợi ý nhân viên theo Tên (name) hoặc ID.
     * Trả về chuỗi dạng "Tên (ID: X)"
     * @param query Từ khóa tìm kiếm (có thể là tên hoặc số ID)
     * @param limit Giới hạn số lượng
     * @return Danh sách chuỗi gợi ý
     */
    @Query("SELECT CONCAT(s.name, ' (ID: ', s.id, ')') FROM Staff s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "CAST(s.id AS string) LIKE CONCAT(:query, '%')") // Tìm ID bắt đầu bằng query
    List<String> findSuggestionsByNameOrId(@Param("query") String query, org.springframework.data.domain.Pageable limit);
}

