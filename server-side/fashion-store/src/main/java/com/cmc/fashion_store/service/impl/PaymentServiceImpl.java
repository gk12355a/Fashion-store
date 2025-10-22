package com.cmc.fashion_store.service.impl;

import com.cmc.fashion_store.dto.CreatePaymentRequest;
import com.cmc.fashion_store.dto.UpdatePaymentRequest; // Import DTO mới
import com.cmc.fashion_store.dto.PaymentResponse;
import com.cmc.fashion_store.dto.StaffResponse;
import com.cmc.fashion_store.model.Order; // Import Order
import com.cmc.fashion_store.model.Payment;
import com.cmc.fashion_store.model.Staff;
import com.cmc.fashion_store.repository.OrderRepository; // Import OrderRepository
import com.cmc.fashion_store.repository.PaymentRepository;
import com.cmc.fashion_store.repository.StaffRepository;
import com.cmc.fashion_store.service.PaymentService;
import jakarta.persistence.EntityNotFoundException; // Import Exception
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page; // Import Page
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; // Import Pageable
import org.modelmapper.ModelMapper; // <-- THÊM IMPORT NÀY (Nếu bạn dùng ModelMapper)
@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository; // Inject OrderRepository
    
    @Autowired
    private StaffRepository staffRepository;
    @Autowired // Inject ModelMapper nếu bạn dùng
    private ModelMapper modelMapper;

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        Page<Payment> paymentPage = paymentRepository.findAll(pageable);
        return paymentPage.map(this::convertToDto); // Hàm này đã được sửa
    }

    // Hàm helper để chuyển đổi Entity sang DTO
    private PaymentResponse convertToDto(Payment payment) {
        PaymentResponse dto = new PaymentResponse();
        dto.setId(payment.getId());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        if (payment.getOrder() != null) {
            dto.setOrderId(payment.getOrder().getId());
        }

        // --- THÊM LOGIC LẤY THÔNG TIN STAFF ---
        if (payment.getStaff() != null) {
            Staff staffEntity = payment.getStaff();
            // Cách 1: Dùng ModelMapper (nếu đã cấu hình)
            StaffResponse staffDto = modelMapper.map(staffEntity, StaffResponse.class);
            dto.setStaff(staffDto);

            // Cách 2: Gán thủ công (nếu không dùng ModelMapper)
            // StaffResponse staffDto = new StaffResponse();
            // staffDto.setId(staffEntity.getId());
            // staffDto.setName(staffEntity.getName());
            // dto.setStaff(staffDto);
        } else {
             dto.setStaff(null); // Hoặc một StaffResponse rỗng nếu cần
        }
        // --- KẾT THÚC THÊM LOGIC ---

        return dto;
    }

    @Override
    @Transactional
    public Payment createPayment(CreatePaymentRequest request) {
        // 1. Tìm Order
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Đơn hàng: " + request.getOrderId()));

        // 2. Tìm Staff
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Nhân viên: " + request.getStaffId()));

        // 3. Kiểm tra logic (đã làm)
        if (order.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Không thể thanh toán cho đơn hàng 0 đồng.");
        }
        if (order.getStatus().equals("Đã thanh toán")) {
            throw new IllegalArgumentException("Đơn hàng này đã được thanh toán rồi.");
        }

        // 4. Tạo Payment
        Payment newPayment = new Payment();
        newPayment.setOrder(order);
        newPayment.setPaymentMethod(request.getPaymentMethod());
        newPayment.setAmount(order.getTotalAmount());
        newPayment.setPaymentDate(LocalDateTime.now());
        newPayment.setStaff(staff); // <-- GÁN NHÂN VIÊN VÀO THANH TOÁN

        // 5. Lưu Payment
        Payment savedPayment = paymentRepository.save(newPayment);

        // 6. Cập nhật Order Status (đã làm)
        order.setStatus("Đã thanh toán");
        orderRepository.save(order);

        return savedPayment;
    }

    @Override
    public void deletePayment(Long id) {
        // Kiểm tra xem thanh toán có tồn tại không trước khi xóa
        if (!paymentRepository.existsById(id)) {
            // Nếu không tìm thấy, ném ra một exception để báo lỗi
            throw new EntityNotFoundException("Không tìm thấy thanh toán với ID: " + id);
        }
        paymentRepository.deleteById(id);
    }

    @Override
    public List<PaymentResponse> searchPayments(Long orderId, String paymentMethod) {
        List<Payment> results;
        if (orderId != null) {
            results = paymentRepository.findByOrderId(orderId);
        } else if (paymentMethod != null && !paymentMethod.isBlank()) {
            results = paymentRepository.findByPaymentMethodContainingIgnoreCase(paymentMethod);
        } else {
            return Collections.emptyList();
        }
        // Chuyển đổi kết quả tìm kiếm sang DTO
        return results.stream()
                .map(this::convertToDto) // Vẫn dùng hàm helper đã sửa
                .collect(Collectors.toList());
    }
    @Override
    public PaymentResponse updatePayment(Long id, UpdatePaymentRequest request) {
        // 1. Tìm thanh toán trong DB
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thanh toán với ID: " + id));

        // 2. Cập nhật thông tin
        existingPayment.setPaymentMethod(request.getPaymentMethod());

        // --- XÓA LOGIC CẬP NHẬT SỐ TIỀN ---
        // Bạn không nên cho phép cập nhật số tiền của thanh toán một cách độc lập.
        // Nếu Order thay đổi, nên tạo một thanh toán mới hoặc hủy thanh toán cũ.
        // Dòng cũ bị xóa: existingPayment.setAmount(request.getAmount());
        // ---------------------------------

        // 3. Lưu lại vào DB
        Payment updatedPayment = paymentRepository.save(existingPayment);

        // 4. Chuyển đổi Entity đã cập nhật sang DTO để trả về
        return convertToDto(updatedPayment);
    }
    // --- IMPLEMENT PHƯƠNG THỨC MỚI ---
    @Override
    @Transactional(readOnly = true)
    public List<String> getPaymentMethodSuggestions(String query) {
        // Lấy tối đa 5 gợi ý
        Pageable limit = PageRequest.of(0, 5);
        return paymentRepository.findDistinctPaymentMethods(query, limit);
    }
}