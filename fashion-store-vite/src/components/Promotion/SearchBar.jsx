import React from "react";
import "../SearchBar.css"; // Dùng chung CSS

// 1. Nhận props mới
export default function SearchBar({ search, setSearch, onAddNew, suggestions, onSuggestionClick, onBlur }) {
  return (
    // 2. Thêm wrapper
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm theo Tên hoặc Loại KM..." // Cập nhật placeholder
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={onBlur} // Thêm onBlur
          autoComplete="off"
        />
        <button onClick={onAddNew}>+ Thêm khuyến mãi</button>
      </div>
      {/* 3. Hiển thị gợi ý */}
      {suggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li key={index} className="suggestion-item" onMouseDown={() => onSuggestionClick(item)}>
              {item} {/* Hiển thị chuỗi "Tên (Loại: X)" */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}