// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import "../styles/Common.css";

export default function HomePage() {
  return (
    <div className="home">
      <div className="welcome">
        <h1>Chào mừng đến với hệ thống quản lý cửa hàng Vélin</h1>
        <p>
          Hệ thống quản lý cửa hàng thời trang toàn diện, giúp bạn quản lý sản phẩm, đơn hàng, khách hàng, nhân viên, thanh toán và khuyến mãi một cách hiệu quả.
        </p>
        <button><Link to="/sanpham">Sản phẩm</Link></button>
        <button><Link to="/donhang">Đơn hàng</Link></button>
      </div>

      <div className="features">
        <Feature icon="👕" title="Quản lý sản phẩm" link="/sanpham"
          desc="Quản lý danh sách sản phẩm thời trang, thêm mới, chỉnh sửa thông tin, giá cả và trạng thái có sẵn." />

        <Feature icon="👥" title="Quản lý khách hàng" link="/khachhang"
          desc="Lưu trữ thông tin khách hàng, điểm tích lũy, loại thành viên và lịch sử mua hàng." />

        <Feature icon="📦" title="Quản lý đơn hàng" link="/donhang"
          desc="Theo dõi đơn hàng, trạng thái, tính toán tổng tiền và hóa đơn." />

        <Feature icon="📋" title="Quản lý chi tiết đơn hàng" link="/chitietdonhang"
          desc="Quản lý chi tiết từng đơn hàng, sản phẩm trong đơn, số lượng và giá trị." />

        <Feature icon="👔" title="Quản lý nhân viên" link="/nhanvien"
          desc="Quản lý thông tin nhân viên, ca làm việc, chức vụ và lương thưởng." />

        <Feature icon="💳" title="Quản lý thanh toán" link="/thanhtoan"
          desc="Xử lý thanh toán, theo dõi doanh thu, hóa đơn và các khoản chi." />

        <Feature icon="🎁" title="Quản lý khuyến mãi" link="/khuyenmai"
          desc="Tạo và quản lý chương trình khuyến mãi, mã giảm giá và ưu đãi đặc biệt." />
      </div>
    </div>
  );
}

function Feature({ icon, title, desc, link }) {
  return (
    <div className="feature">
      <div className="icon">{icon}</div>
      <h2>{title}</h2>
      <p>{desc}</p>
      <Link to={link}>Xem chi tiết →</Link>
    </div>
  );
}
