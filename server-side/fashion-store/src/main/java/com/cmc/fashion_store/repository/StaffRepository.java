package com.cmc.fashion_store.repository;
import com.cmc.fashion_store.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

