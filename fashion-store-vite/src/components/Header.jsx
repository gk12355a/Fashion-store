// src/components/Header.jsx
import { NavLink } from "react-router-dom";

export default function Header() {
  const baseLinkClass =
    "block whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold no-underline transition-all duration-300 ease-in-out md:text-base";
  const inactiveLinkClass = "text-gray-800 hover:bg-[#cd034d] hover:text-white";
  const activeLinkClass =
    "relative font-semibold text-[#dc3545] after:content-[''] after:absolute after:bottom-[-5px] after:left-1/2 after:h-0.5 after:w-4/5 after:-translate-x-1/2 after:bg-[#dc3545]";
  
  const getNavLinkClass = ({ isActive }) => {
    return `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;
  };

  const logoLinkClass =
    "flex items-center whitespace-nowrap font-['Imperial_Script'] text-2xl font-bold text-gray-800 no-underline md:text-4xl";
  const logoIconClass = "mr-2.5 text-lg md:text-3xl";
  const headerClass =
    "sticky top-0 z-[1000] mx-auto flex w-full flex-wrap items-center justify-between bg-[#B2C4A3] py-4 px-5 shadow-lg border-b-[3px] border-[#e0e0e0]";

  const navListClass = "ml-2.5 flex list-none flex-wrap gap-2.5 md:mr-8";

  return (
    <header className={headerClass}>
      <div className="flex items-center">
        <NavLink to="/" className={logoLinkClass} end>
          <span className={logoIconClass}>🛍️</span>
          Vélin Store
        </NavLink>
      </div>
      <nav className="flex items-center">
        <ul className={navListClass}>
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