package com.cmc.fashion_store.controller;
import com.cmc.fashion_store.dto.CreateStaffRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateStaffRequest;
import com.cmc.fashion_store.model.Staff;
import com.cmc.fashion_store.service.StaffService;
import jakarta.validation.Valid; // Import cho @Valid
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.Pageable; // Import Pageable
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/staffs")//// Sử dụng prefix /api/v1 từ file properties
public class StaffController {
     @Autowired
    private StaffService staffService;
     // API này giờ sẽ nhận các tham số như page, size
    @GetMapping
    public ResponseEntity<Page<Staff>> getAllStaffs(Pageable pageable) {
        Page<Staff> staffs = staffService.getAllStaffs(pageable);
        return new ResponseEntity<>(staffs, HttpStatus.OK);
    }
    // API này sẽ xử lý yêu cầu POST đến /api/v1/products
    @PostMapping
    public ResponseEntity<Staff> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        Staff createdStaff = staffService.createStaff(request);
        return new ResponseEntity<>(createdStaff, HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<List<Staff>> searchStaff(@RequestParam String keyword) {
        List<Staff> results = staffService.searchStaff(keyword);
        return ResponseEntity.ok(results);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @Valid @RequestBody UpdateStaffRequest request) {
        Staff updatedStaff = staffService.updateStaff(id, request);
        return ResponseEntity.ok(updatedStaff);
    }
}