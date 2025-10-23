package com.cmc.fashion_store.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder // Dùng Builder pattern để dễ tạo đối tượng
public class OrderReportRowDto {
    private Long maDonHang;
    private LocalDateTime ngayDat;
    private Long maKhachHang;
    private String tenKhachHang;
    private String soDienThoaiKH;
    private String emailKH;
    private String trangThai;
    private BigDecimal tongTienGoc; // Subtotal
    private Long maKhuyenMai;
    private String tenKhuyenMai;
    private BigDecimal giaTriKhuyenMai; // Giá trị số (VNĐ hoặc %)
    private String loaiKhuyenMai;       // Loại KM (PERCENTAGE/FIXED_AMOUNT)
    private BigDecimal tongTienThanhToan; // Final total
    private LocalDateTime ngayThanhToan;
    private String phuongThucThanhToan;
    private Long maNhanVien;
    private String tenNhanVien;
}