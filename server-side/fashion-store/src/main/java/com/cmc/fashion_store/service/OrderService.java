package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.OrderResponse;
// import com.cmc.fashion_store.dto.CreateOrderRequest; // <-- 1. Xóa import DTO cũ
import com.cmc.fashion_store.dto.CreateOrderWithDetailsRequest; // <-- 2. Thêm import DTO mới
import com.cmc.fashion_store.dto.UpdateOrderRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.cmc.fashion_store.model.Order;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    /**
     * Lấy danh sách đơn hàng có phân trang.
     * @param pageable đối tượng chứa thông tin phân trang (số trang, kích thước trang).
     * @return một trang (Page) chứa danh sách Order và thông tin phân trang.
     */
    Page<OrderResponse> getAllOrders(
            Pageable pageable,
            Long customerId,
            String status,
            LocalDate orderDate // <-- Dùng LocalDate cho đơn giản
    );

    /**
     * Tạo một đơn hàng mới CÙNG VỚI các chi tiết của nó.
     * @param request thông tin đơn hàng mới (bao gồm khách hàng, khuyến mãi và danh sách sản phẩm).
     * @return Order đã được tạo.
     */
    // 3. Thay đổi chữ ký phương thức
    Order createOrder(CreateOrderWithDetailsRequest request);

    /**
     * Xóa một đơn hàng dựa vào ID.
     * @param id ID của đơn hàng cần xóa.
     */
    void deleteOrder(Long id);

    /**
     * Tìm kiếm đơn hàng dựa trên các tiêu chí tùy chọn.
     * @param customerId ID của khách hàng (có thể null).
     * @param status Trạng thái đơn hàng (có thể null).
     * @return Danh sách đơn hàng phù hợp.
     */
    List<OrderResponse> searchOrders(Long customerId, String status);

    /**
     * Cập nhật thông tin một đơn hàng.
     * @param id ID của đơn hàng cần cập nhật.
     * @param request Đối tượng chứa thông tin mới.
     * @return Order đã được cập nhật.
     */
    Order updateOrder(Long id, UpdateOrderRequest request);
    /**
     * Dịch vụ xuất dữ liệu đơn hàng ra chuỗi CSV.
     * @param startDate Ngày bắt đầu
     * @param endDate Ngày kết thúc
     * @return Một chuỗi String chứa nội dung file CSV
     */
    String exportOrdersToCsv(LocalDate startDate, LocalDate endDate) throws Exception;
}