package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateOrderRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateOrderRequest; // Import DTO mới
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // Import Pageable
import com.cmc.fashion_store.model.Order;
import java.util.List;

public interface OrderService {
    /**
     * Lấy danh sách đơn hàng có phân trang.
     * @param pageable đối tượng chứa thông tin phân trang (số trang, kích thước trang).
     * @return một trang (Page) chứa danh sách Order và thông tin phân trang.
     */
    Page<Order> getAllOrders(Pageable pageable);
    /**
     * Tạo một đơn hàng mới.
     * @param request thông tin đơn hàng mới.
     * @return Order đã được tạo.
     */
    Order createOrder(CreateOrderRequest request);
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
    List<Order> searchOrders(Long customerId, String status);
    /**
     * Cập nhật thông tin một đơn hàng.
     * @param id ID của đơn hàng cần cập nhật.
     * @param request Đối tượng chứa thông tin mới.
     * @return Order đã được cập nhật.
     */
    Order updateOrder(Long id, UpdateOrderRequest request);
}