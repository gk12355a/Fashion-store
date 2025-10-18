import React from "react";
import "../SearchBar.css";

export default function SearchBar({ search, setSearch, onAdd }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm theo tên, loại, size, màu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={onAdd}>+ Thêm sản phẩm</button>
    </div>
  );
}
