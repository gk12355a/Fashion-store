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
}