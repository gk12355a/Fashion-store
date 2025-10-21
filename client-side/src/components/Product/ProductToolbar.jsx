import React from 'react';
import './ProductToolbar.css'; // Chúng ta sẽ tạo file CSS này ngay sau đây

export default function ProductToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  // Hàm này xử lý các nút bấm (Mới nhất, Tên, Số lượng)
  const handleSortButton = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  // Hàm này xử lý riêng cho dropdown "Giá"
  const handlePriceSortChange = (e) => {
    const value = e.target.value; // 'price,asc' hoặc 'price,desc'
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Hàm lấy class CSS cho các nút, để tô đậm nút đang active
  const getButtonClass = (field, order) => {
    return `sort-btn ${sortField === field && sortOrder === order ? 'active' : ''}`;
  };

  // Xác định giá trị hiện tại của dropdown "Giá"
  const priceSelectValue = sortField === 'price' ? `price,${sortOrder}` : '';

  // Xử lý chuyển trang
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="product-toolbar">
      {/* ----- KHU VỰC SẮP XẾP ----- */}
      <div className="sort-options">
        <span>Sắp xếp theo</span>
        {/* Nút "Mới Nhất" (Giả sử sort theo id, giảm dần) */}
        <button
          className={getButtonClass('id', 'desc')}
          onClick={() => handleSortButton('id', 'desc')}
        >
          Mới Nhất
        </button>

        {/* Nút "Tên" (A-Z) */}
        <button
          className={getButtonClass('name', 'asc')}
          onClick={() => handleSortButton('name', 'asc')}
        >
          Tên (A-Z)
        </button>
        
        {/* Nút "Số Lượng" (Tồn kho ít nhất) */}
        <button
          className={getButtonClass('stockQuantity', 'asc')}
          onClick={() => handleSortButton('stockQuantity', 'asc')}
        >
          Tồn kho (Ít)
        </button>

        {/* Dropdown "Giá" */}
        <select
          value={priceSelectValue}
          onChange={handlePriceSortChange}
          className={`sort-select ${sortField === 'price' ? 'active-select' : ''}`}
        >
          <option value="" disabled>Giá</option>
          <option value="price,asc">Giá: Thấp đến Cao</option>
          <option value="price,desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      {/* ----- KHU VỰC PHÂN TRANG ----- */}
      <div className="pagination-controls">
        <span className="page-info">{totalPages > 0 ? currentPage : 0}/{totalPages}</span>
        <button 
          onClick={handlePrev} 
          disabled={currentPage === 1 || totalPages === 0}
          className="page-nav"
        >
          &lt;
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentPage === totalPages || totalPages === 0}
          className="page-nav"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}