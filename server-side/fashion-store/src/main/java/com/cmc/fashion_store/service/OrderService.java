package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateOrderRequest; // Import DTO
import com.cmc.fashion_store.dto.UpdateOrderRequest; // Import DTO mới
import com.cmc.fashion_store.model.Order;
import java.util.List;

public interface OrderService {
    /**
     * Lấy danh sách tất cả đơn hàng.
     * @return danh sách Order.
     */
    List<Order> getAllOrders();
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