import React from "react";
import "../SearchBar.css"; // Dùng chung CSS

// 1. Nhận props mới: suggestions, onSuggestionClick, onBlur
export default function SearchBar({ 
  search, 
  setSearch, 
  onAdd, 
  suggestions, 
  onSuggestionClick, 
  onBlur 
}) {
  return (
    // 2. Thêm class wrapper
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm theo tên, SĐT hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={onBlur} // 3. Thêm onBlur
          autoComplete="off"
        />
        <button onClick={onAdd}>+ Thêm khách hàng</button>
      </div>

      {/* 4. Hiển thị danh sách gợi ý */}
      {suggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item, index) => (
            <li 
              key={index} 
              className="suggestion-item"
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