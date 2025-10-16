package com.cmc.fashion_store.service;

import com.cmc.fashion_store.dto.CreateOrderDetailRequest; // Import DTO
import com.cmc.fashion_store.model.OrderDetail;
import java.util.List;

public interface OrderDetailService {
    /**
     * Lấy danh sách tất cả chi tiết đơn hàng.
     * @return danh sách OrderDetail.
     */
    List<OrderDetail> getAllOrderDetails();
    /**
     * Tạo một chi tiết đơn hàng mới.
     * @param request thông tin chi tiết đơn hàng mới.
     * @return OrderDetail đã được tạo.
     */
    OrderDetail createOrderDetail(CreateOrderDetailRequest request);
    /**
     * Xóa một chi tiết đơn hàng dựa vào ID.
     * @param id ID của chi tiết đơn hàng cần xóa.
     */
    void deleteOrderDetail(Long id);
    /**
     * Tìm kiếm chi tiết đơn hàng và trả về danh sách Entity.
     * @param orderId ID của đơn hàng (có thể null).
     * @param productId ID của sản phẩm (có thể null).
     * @return Danh sách chi tiết đơn hàng (Entity) phù hợp.
     */
    List<OrderDetail> searchOrderDetails(Long orderId, Long productId);
}