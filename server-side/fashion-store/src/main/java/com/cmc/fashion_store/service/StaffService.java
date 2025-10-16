package com.cmc.fashion_store.service;
import com.cmc.fashion_store.dto.CreateStaffRequest; // Import CreateStaffRequest DTO
import com.cmc.fashion_store.dto.UpdateStaffRequest; // Import UpdateStaffRequest DTO
import com.cmc.fashion_store.model.Staff; // Import Staff model
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import java.util.List;
public interface StaffService {
    /**
     * Lấy danh sách tất cả nhân viên có phân trang.
     * @param pageable đối tượng chứa thông tin phân trang (số trang, kích thước trang).
     * @return một trang (Page) chứa danh sách Product và thông tin phân trang.
     */
    Page<Staff> getAllStaffs(Pageable pageable);
     /**
     * Tạo một nhân viên mới dựa trên thông tin yêu cầu.
     * @param request đối tượng chứa thông tin nhân viên mới.
     * @return Staff đã được tạo và lưu trong DB.
     */
    Staff createStaff(CreateStaffRequest request);
     /**
     * Cập nhật thông tin của một nhân viên dựa trên ID và thông tin yêu cầu.
     * @param id ID của nhân viên cần cập nhật.
     * @param request đối tượng chứa thông tin cập nhật cho nhân viên.
     * @return Staff đã được cập nhật.
     */
    Staff updateStaff(Long id, UpdateStaffRequest request);
     /**
     * Xoa nhân viên dựa trên ID.
     * @param id ID của nhân viên cần xoa.
     */
    void deleteStaff(Long id);
    /**
     * Tìm kiếm nhân viên dựa trên các tiêu chí.
     * @param query Từ khóa tìm kiếm chung.
     * @return Danh sách nhân viên phù hợp.
     */
    List<Staff> searchStaff(String query);
}
