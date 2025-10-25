// src/components/Header.jsx
import { NavLink } from "react-router-dom";

export default function Header() {
  // 🧱 Lớp chung cho các link trong nav
  const baseLinkClass =
    "block whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-bold no-underline transition-all duration-300 ease-in-out md:text-base"; // font-bold -> chữ đậm hơn

  const inactiveLinkClass =
    "text-gray-900 hover:bg-[#cd034d] hover:text-white"; // chữ đậm + màu chữ tối hơn
  const activeLinkClass =
    "relative font-extrabold text-[#dc3545] after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:h-0.5 after:w-4/5 after:-translate-x-1/2 after:bg-[#dc3545]";

  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

  // 🏷️ Logo chính
  const logoLinkClass =
    "flex items-center whitespace-nowrap font-['Imperial_Script'] text-3xl md:text-5xl font-extrabold text-gray-900 no-underline tracking-wide";
  const logoIconClass = "mr-3 text-2xl md:text-4xl";

  // ✅ Header có nền và border
  const headerClass =
    "sticky top-0 z-[1000] mx-auto flex w-full flex-wrap items-center justify-between bg-[#B2C4A3] py-5 px-6 shadow-xl border-b-[3px] border-[#a5b58e]";

  const navListClass = "ml-3 flex list-none flex-wrap gap-3 md:mr-10";

  return (
    <header className={headerClass}>
      <div className="flex items-center">
        <NavLink to="/" className={logoLinkClass} end>
          <span className={logoIconClass}>
  <img
    src="../../logo.png"
    alt="Logo"
    className="w-30 h-30 md:w-20 md:h-20 object-contain"
  />
</span>

          {/* 🌟 Làm nổi bật chữ “Vélin” */}
          <span
            className="bg-gradient-to-r from-[#567c2d] to-[#95b46a] bg-clip-text text-transparent drop-shadow-sm"
          >
            Vélin
          </span>
          <span className="ml-2 text-gray-900 text-2xl md:text-4xl font-bold">
            Store
          </span>
        </NavLink>
      </div>

      <nav className="flex items-center">
        <ul className={navListClass}>
          <li>
            <NavLink to="/sanpham" className={getNavLinkClass}>
              Sản phẩm
            </NavLink>
          </li>
          <li>
            <NavLink to="/khachhang" className={getNavLinkClass}>
              Khách hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/donhang" className={getNavLinkClass}>
              Đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/chitietdonhang" className={getNavLinkClass}>
              Chi tiết đơn hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/nhanvien" className={getNavLinkClass}>
              Nhân viên
            </NavLink>
          </li>
          <li>
            <NavLink to="/thanhtoan" className={getNavLinkClass}>
              Thanh toán
            </NavLink>
          </li>
          <li>
            <NavLink to="/khuyenmai" className={getNavLinkClass}>
              Khuyến mãi
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
