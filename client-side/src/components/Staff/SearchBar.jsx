import React from "react";
import "../SearchBar.css";

// Sửa prop name onAdd -> onAddNew
export default function SearchBar({ search, setSearch, onAddNew }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo tên hoặc chức vụ..." // Giữ nguyên
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={onAddNew}>+ Thêm nhân viên</button> 
    </div>
  );
}