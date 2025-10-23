import React, { useState, useEffect, useRef } from 'react';
import api from '../../api'; // Đảm bảo đường dẫn này đúng
import './ReusableSearch.css'; // Sẽ tạo file CSS này ở bước tiếp theo

/**
 * Component tìm kiếm-autocomplete có thể tái sử dụng.
 * @param {string} searchApiUrl - Endpoint API (ví dụ: "/products/search")
 * @param {string} placeholder - Chữ hiển thị mờ
 * @param {function} onSelect - Hàm callback trả về (item) khi người dùng chọn.
 * @param {string} displayField - Tên trường để hiển thị (ví dụ: "name")
 * @param {function} renderSuggestion - (Tùy chọn) Hàm tùy chỉnh cách hiển thị gợi ý
 */
export default function ReusableSearch({
  searchApiUrl,
  placeholder,
  onSelect,
  displayField = 'name',
  renderSuggestion,
  disabled = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Effect for fetching suggestions (debounced)
  useEffect(() => {
    // Nếu đã chọn 1 item (và text không thay đổi) -> không tìm
    if (selectedItem && searchTerm === selectedItem[displayField]) {
      setSuggestions([]);
      return;
    }
    // Nếu xóa hết chữ -> reset
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setSelectedItem(null);
      onSelect(null); // Báo cho component cha là đã clear
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Gọi API /search (ví dụ: /products/search?q=ao)
        const response = await api.get(searchApiUrl, {
          params: { q: searchTerm },
        });
        
        // Chỉ lấy 10 gợi ý đầu tiên
        setSuggestions((response.data || []).slice(0, 10));
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải gợi ý:', error);
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, searchApiUrl, selectedItem, displayField]);

  // Xử lý khi bấm chọn 1 gợi ý
  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(item[displayField]); // Hiển thị tên
    setSuggestions([]);
    onSelect(item); // Gửi toàn bộ object (item) về cho cha
  };

  // Xử lý khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  // Hàm hiển thị mặc định (nếu không có renderSuggestion)
  const defaultRender = (item) => (
    <>
      {item[displayField]}
      {/* Hiển thị thêm thông tin nếu là Product hoặc Customer */}
      {item.price && (
        <span style={{ color: '#0ca678', marginLeft: '10px' }}>
          ({item.price.toLocaleString()} đ)
        </span>
      )}
      {item.email && (
        <span style={{ color: '#888', marginLeft: '10px' }}>
          ({item.email})
        </span>
      )}
    </>
  );

  return (
    <div className="reusable-search-wrapper" ref={wrapperRef}>
      <input
        type="text"
        className={`reusable-search-input ${selectedItem ? 'selected' : ''}`}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
      {isLoading && <div className="spinner"></div>}

      {suggestions.length > 0 && (
        <ul className="reusable-suggestions-list">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="reusable-suggestion-item"
              onMouseDown={() => handleSelect(item)} // Dùng onMouseDown
            >
              {/* Dùng hàm render tùy chỉnh hoặc hàm mặc định */}
              {renderSuggestion ? renderSuggestion(item) : defaultRender(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}