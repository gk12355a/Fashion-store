package com.cmc.fashion_store.service.impl;
import com.cmc.fashion_store.dto.CreateStaffRequest;
import com.cmc.fashion_store.dto.UpdateStaffRequest; // Import DTO mới
import com.cmc.fashion_store.model.Staff;
import com.cmc.fashion_store.repository.StaffRepository;
import com.cmc.fashion_store.service.StaffService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class StaffServiceImpl implements StaffService {
    @Autowired
    private StaffRepository staffRepository;
    @Override
    public Page<Staff> getAllStaffs(Pageable pageable) {
        //Chỉ cần gọi phương thức findAll của repository với tham số pageable`
        return staffRepository.findAll(pageable);
    }

    @Override
    public Staff createStaff(CreateStaffRequest request) {
        // Chuyển đổi từ dto sang entity(Đối tượng lưu trong DB)
        Staff staff = new Staff();
        // Gán các trường từ request vào staff
        staff.setName(request.getName());
        staff.setPosition(request.getPosition());
        staff.setSalary(request.getSalary());
        staff.setWorkShift(request.getWorkShift());
        // Lưu nhân viên
        return staffRepository.save(staff);
    }

    @Override
    public Staff updateStaff(Long id, UpdateStaffRequest request) {
        // 1. Tìm nhân viên trong DB bằng ID. Nếu không thấy, ném ra lỗi.
        Staff existingStaff = staffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));
        // 2. Cập nhật các trường từ request vào existingStaff
        existingStaff.setName(request.getName());
        existingStaff.setPosition(request.getPosition());
        existingStaff.setSalary(request.getSalary());
        existingStaff.setWorkShift(request.getWorkShift());
        // 3. Lưu nhân viên
        return staffRepository.save(existingStaff);
    }

    @Override
    public void deleteStaff(Long id) {
        // 1. Tìm nhân viên trong DB bằng ID. Nếu không thấy, ném ra lỗi.
        if (!staffRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id);
        }
        // 2. Xoá nhân viên
        staffRepository.deleteById(id);
    }

    @Override
    public List<Staff> searchStaff(String query) {
        // Sử dụng phương thức tìm kiếm đã định nghĩa trong repository
        return staffRepository.findByNameContainingIgnoreCaseOrPositionContainingIgnoreCase(query, query);
    }
    // --- IMPLEMENT PHƯƠNG THỨC MỚI ---
    @Override
    @Transactional(readOnly = true)
    public List<String> getStaffSuggestions(String query) {
        Pageable limit = PageRequest.of(0, 5); // Lấy 5 gợi ý
        return staffRepository.findSuggestionsByNameOrId(query, limit);
    }
}