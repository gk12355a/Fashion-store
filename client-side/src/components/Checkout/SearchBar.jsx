import React from "react";
import "../SearchBar.css"; // Dùng chung CSS

// 1. Nhận props mới
export default function SearchBar({
  search,
  setSearch,
  onAdd,
  suggestions,
  onSuggestionClick,
  onBlur
}) {
  return (
    <div className="search-bar-wrapper"> {/* Giữ wrapper */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm theo Mã đơn hàng hoặc Phương thức TT..." // Placeholder giữ nguyên
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={onBlur} // 2. Thêm onBlur
          autoComplete="off" // Tắt gợi ý mặc định
        />
        <button onClick={onAdd}>+ Thêm thanh toán</button>
      </div>

      {/* 3. Hiển thị danh sách gợi ý (dùng CSS chung) */}
      {suggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="suggestion-item"
              // Dùng onMouseDown
              onMouseDown={() => onSuggestionClick(item)}
            >
              {item} {/* Hiển thị tên phương thức */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}