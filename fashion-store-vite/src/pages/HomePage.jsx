// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
// import "../styles/Common.css"; // <- ĐÃ XÓA

export default function HomePage() {
  
  // --- Định nghĩa lớp Tailwind (Dịch từ Common.css) ---
  
  // Dịch từ .welcome
  const welcomeClass = "bg-white rounded-2xl py-12 px-10 my-12 mx-auto text-center shadow-lg max-w-[60%] border-2 border-[#ffd1dc] transition-transform duration-300 ease-in-out hover:-translate-y-1";
  
  // Dịch từ .welcome h1
  const h1Class = "font-['Playfair_Display'] text-3xl mb-4 text-gray-800";
  
  // Dịch từ .welcome p
  const pClass = "text-lg my-4 mx-auto mb-8 text-[#09c3a7] leading-relaxed max-w-4xl text-balance";
  
  // Dịch từ .welcome button
  const buttonClass = "bg-[#f18484] text-white border-none py-3 px-7 m-2 rounded-lg cursor-pointer text-base font-semibold transition-all duration-250 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-[#c61d42]";
  
  // Dịch từ .features (với responsive)
  const featuresClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 my-16 mx-auto max-w-6xl px-5";
  
  // Lớp gốc cho page (lấy padding từ .main-content)
  const pageClass = "p-5";
  
  // --- Kết thúc định nghĩa lớp ---
  
  return (
    <div className={pageClass}>
      <div className={welcomeClass}>
        <h1 className={h1Class}>Chào mừng đến với hệ thống quản lý cửa hàng Vélin</h1>
        <p className={pClass}>
          Hệ thống quản lý cửa hàng thời trang toàn diện, giúp bạn quản lý sản phẩm, đơn hàng, khách hàng, nhân viên, thanh toán và khuyến mãi một cách hiệu quả.
        </p>
        <button className={buttonClass}><Link to="/sanpham" className="text-white no-underline font-poppins">Sản phẩm</Link></button>
        <button className={buttonClass}><Link to="/donhang" className="text-white no-underline font-poppins">Đơn hàng</Link></button>
      </div>

      <div className={featuresClass}>
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
        <Feature icon="📖" title="Hướng dẫn sử dụng" link="/huongdansudung"
          desc="Mọi hướng dẫn nằm ở đây" />  
      </div>
    </div>
  );
}

// Component Feature con cũng được dịch sang Tailwind
function Feature({ icon, title, desc, link }) {
  
  // Dịch từ .feature
  const featureClass = "bg-white rounded-xl p-5 text-center shadow-lg border border-[#ffd1dc] transition-all duration-250 ease-in-out hover:-translate-y-1 hover:shadow-xl";
  // Dịch từ .feature .icon
  const iconClass = "text-4xl text-[#a9dfbf] mb-2.5";
  // Dịch từ .feature h2
  const titleClass = "font-['Playfair_Display'] text-xl text-[#d66161] my-2.5";
  // Dịch từ .feature p
  const descClass = "text-sm text-gray-600 leading-normal mb-3.5";
  // Dịch từ .feature a
  const linkClass = "inline-block bg-[#288a4f] text-white py-2 px-4 rounded-lg no-underline font-semibold text-sm transition-all duration-200 ease-in-out hover:scale-105 hover:bg-[#1cb65f]";
      
  return (
    <div className={featureClass}>
      <div className={iconClass}>{icon}</div>
      <h2 className={titleClass}>{title}</h2>
      <p className={descClass}>{desc}</p>
      <Link to={link} className={linkClass}>Xem chi tiết →</Link>
    </div>
  );
}