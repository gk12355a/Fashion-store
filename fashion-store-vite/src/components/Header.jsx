// src/components/Header.jsx
import { NavLink } from "react-router-dom"; // [1] Thay 'Link' bằng 'NavLink'
import "../styles/Common.css";

export default function Header() {
  // [2] Hàm này sẽ trả về class 'active-link' nếu link đang được chọn
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "active-link" : "";
  };

  return (
    <header>
      <div className="logo">
        {/* [3] Dùng NavLink cho cả logo, thêm 'end' để nó chỉ active ở trang chủ */}
        <NavLink to="/" className={getNavLinkClass} end>
          Vélin
        </NavLink>
      </div>
      <nav>
        <ul>
          {/* [4] Áp dụng NavLink và hàm class cho tất cả các mục */}
          <li><NavLink to="/sanpham" className={getNavLinkClass}>Sản phẩm</NavLink></li>
          <li><NavLink to="/khachhang" className={getNavLinkClass}>Khách hàng</NavLink></li>
          <li><NavLink to="/donhang" className={getNavLinkClass}>Đơn hàng</NavLink></li>
          <li><NavLink to="/chitietdonhang" className={getNavLinkClass}>Chi tiết đơn hàng</NavLink></li>
          <li><NavLink to="/nhanvien" className={getNavLinkClass}>Nhân viên</NavLink></li>
          <li><NavLink to="/thanhtoan" className={getNavLinkClass}>Thanh toán</NavLink></li>
          <li><NavLink to="/khuyenmai" className={getNavLinkClass}>Khuyến mãi</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}