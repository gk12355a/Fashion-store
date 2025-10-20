import React from "react";
import "../SearchBar.css";

// Sửa prop onAdd -> onAddNew
export default function SearchBar({ search, setSearch, onAddNew }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo Tên hoặc Loại..." // Giữ nguyên
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={onAddNew}>+ Thêm khuyến mãi</button> 
    </div>
  );
}