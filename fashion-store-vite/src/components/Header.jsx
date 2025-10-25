// src/components/Header.jsx
import { NavLink } from "react-router-dom";

export default function Header() {
  // Lớp chung cho các link trong nav
  const baseLinkClass =
    "block whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium no-underline transition-all duration-300 ease-in-out md:text-base font-['Helvetica_Neue',_'Arial',_sans-serif]"; // font-medium cho MUJI style

  const inactiveLinkClass =
    "text-white hover:bg-white hover:text-[#7B0323]"; // chữ trắng + hover hiệu ứng
  const activeLinkClass =
    "relative font-semibold text-white after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:h-0.5 after:w-4/5 after:-translate-x-1/2 after:bg-white";

  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

  // Logo chính 
  const logoLinkClass =
    "flex items-center whitespace-nowrap font-['Helvetica_Neue',_'Arial',_sans-serif] text-3xl md:text-4xl font-light text-white no-underline tracking-wider";
  const logoIconClass = "mr-3 w-8 h-8 md:w-14 md:h-10";

  // Header có nền và border
  const headerClass =
    "sticky top-0 z-[1000] mx-auto flex w-full flex-wrap items-center justify-between bg-[#7B0323] py-5 px-6 shadow-xl border-b-[3px] border-[#5a0219]";

  const navListClass = "ml-3 flex list-none flex-wrap gap-3 md:mr-10";

  return (
    <header className={headerClass}>
      <div className="flex items-center">
        <NavLink to="/" className={logoLinkClass} end>
          <img src="../../logo.png" alt="Logo" className={logoIconClass} />

          {/* Làm nổi bật chữ "Vélin" */}
          <span
            className="bg-gradient-to-r from-white to-[#ff4757] bg-clip-text text-transparent drop-shadow-sm font-bold"
          >
            Vélin
          </span>
          <span className="ml-1 text-white text-lg md:text-xl font-light opacity-80 mt-[-10px]">
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
