import React from 'react';
import '../Product/ProductToolbar.css'; // Dùng chung CSS với ProductToolbar

export default function OrderDetailToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  const handleSortChange = (e) => {
    const value = e.target.value; // 'field,order'
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'id,asc';

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
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className="sort-select active-select"
        >
          <option value="id,asc">ID (Tăng)</option>
          <option value="id,desc">ID (Giảm)</option>
          <option value="productId,asc">Mã SP (Tăng)</option>
          <option value="unitPrice,desc">Giá (Cao-Thấp)</option>
          <option value="unitPrice,asc">Giá (Thấp-Cao)</option>
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