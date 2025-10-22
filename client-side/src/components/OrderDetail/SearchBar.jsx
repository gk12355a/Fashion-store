import React from "react";
import "../SearchBar.css"; // Dùng chung CSS

export default function SearchBar({ search, setSearch, onAdd }) {
  return (
    <div className="search-bar-wrapper"> {/* Thêm wrapper */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm theo Mã Đơn Hàng (VD: 1)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={onAdd}>+ Thêm chi tiết đơn</button>
      </div>
    </div>
  );
}