import React from "react";
import "../SearchBar.css"; // Dùng chung CSS

export default function SearchBar({ search, setSearch, onAdd }) {
  return (
    <div className="search-bar-wrapper"> 
      <div className="search-bar">
        <input
          type="text"
          // --- SỬA PLACEHOLDER ---
          placeholder="Tìm theo Mã KH hoặc Trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={onAdd}>+ Thêm đơn hàng</button>
      </div>
    </div>
  );
}