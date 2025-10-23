// src/components/Header.jsx
import { Link } from "react-router-dom";
import "../styles/Common.css";

export default function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src="/images/logo1.png" alt="Logo Vélin" className="logo-img" />
          <span className="brand-text">Vélin</span>
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/sanpham">Sản phẩm</Link></li>
          <li><Link to="/khachhang">Khách hàng</Link></li>
          <li><Link to="/donhang">Đơn hàng</Link></li>
          <li><Link to="/chitietdonhang">Chi tiết đơn hàng</Link></li>
          <li><Link to="/nhanvien">Nhân viên</Link></li>
          <li><Link to="/thanhtoan">Thanh toán</Link></li>
          <li><Link to="/khuyenmai">Khuyến mãi</Link></li>
        </ul>
      </nav>
    </header>
  );
}
