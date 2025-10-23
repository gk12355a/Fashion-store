import React from "react";
import "../SearchBar.css"; // Dùng chung CSS

export default function SearchBar({ search, setSearch, onAdd }) {
  return (
    // 1. Thêm wrapper
    <div className="search-bar-wrapper"> 
      <div className="search-bar">
        <input
          type="text"
          // 2. Sửa placeholder
          placeholder="Tìm theo Mã Khách Hàng (ID)..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={onAdd}>+ Thêm đơn hàng</button>
      </div>
      {/* (Không cần danh sách gợi ý cho trang Order) */}
    </div>
  );
}