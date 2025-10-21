import React from "react";
import "../SearchBar.css";

// 1. Nhận props mới: suggestions, onSuggestionClick, onBlur
export default function SearchBar({ search, setSearch, onAdd, suggestions, onSuggestionClick, onBlur }) {
  return (
    // 2. Thêm class wrapper để định vị
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm theo tên, loại, size, màu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={onBlur} // 3. Thêm onBlur
          autoComplete="off" // Tắt autocomplete mặc định của trình duyệt
        />
        <button onClick={onAdd}>+ Thêm sản phẩm</button>
      </div>

      {/* 4. Hiển thị danh sách gợi ý */}
      {suggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li 
              key={index} 
              className="suggestion-item"
              // Dùng onMouseDown thay vì onClick để chạy trước onBlur
              onMouseDown={() => onSuggestionClick(item)} 
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}