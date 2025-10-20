import React from "react";
import "../SearchBar.css";

export default function SearchBar({ search, setSearch, onAddNew }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo Tên hoặc Loại..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={onAddNew}>+ Thêm khuyến mãi</button>
    </div>
  );
}
