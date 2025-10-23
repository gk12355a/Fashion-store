import React from 'react';
import '../Product/ProductToolbar.css'; // Dùng chung CSS với ProductToolbar

export default function CustomerToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  // Xử lý nút Tên (A-Z)
  const handleNameSort = () => {
    setSortField('name');
    setSortOrder('asc');
  };

  // Xử lý dropdown "Điểm thưởng"
  const handlePointsSortChange = (e) => {
    const value = e.target.value; // 'rewardPoints,asc' hoặc 'rewardPoints,desc'
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Lấy class cho nút Tên
  const getNameButtonClass = () => {
    return `sort-btn ${sortField === 'name' ? 'active' : ''}`;
  };

  // Lấy giá trị cho dropdown Điểm thưởng
  const pointsSelectValue = sortField === 'rewardPoints' ? `rewardPoints,${sortOrder}` : '';

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
        
        {/* Nút "Tên" (A-Z)  */}
        <button
          className={getNameButtonClass()}
          onClick={handleNameSort}
        >
          Tên (A-Z)
        </button>

        {/* Dropdown "Điểm thưởng"  */}
        <select
          value={pointsSelectValue}
          onChange={handlePointsSortChange}
          className={`sort-select ${sortField === 'rewardPoints' ? 'active-select' : ''}`}
        >
          <option value="" disabled>Điểm thưởng</option>
          <option value="rewardPoints,asc">Điểm: Thấp đến Cao</option>
          <option value="rewardPoints,desc">Điểm: Cao đến Thấp</option>
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