import React from 'react';
import '../Product/ProductToolbar.css'; // Dùng chung CSS với ProductToolbar

export default function OrderToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage,
  // --- 1. THÊM PROPS MỚI ---
  startDate,
  endDate,
  onDateChange,   // Hàm xử lý khi ngày thay đổi
  onExportClick,  // Hàm xử lý khi bấm Xuất CSV
  isExporting     // (Tùy chọn) Thêm prop này để vô hiệu hóa nút
}) {

  // Xử lý nút/dropdown Sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value; // 'field,order'
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field);
      setSortOrder(order);
    }
  };

  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'orderDate,desc';

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
    // 2. Cho phép wrap (xuống dòng) và tăng khoảng cách
    <div className="product-toolbar" style={{ flexWrap: 'wrap', gap: '15px' }}>
      {/* ----- KHU VỰC SẮP XẾP ----- */}
      <div className="sort-options">
        <span>Sắp xếp theo</span>
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className="sort-select active-select"
        >
          <option value="orderDate,desc">Mới nhất</option>
          <option value="orderDate,asc">Cũ nhất</option>
          <option value="totalAmount,desc">Tổng tiền: Cao đến Thấp</option>
          <option value="totalAmount,asc">Tổng tiền: Thấp đến Cao</option>
        </select>
      </div>

      {/* --- 3. KHU VỰC LỌC NGÀY (MỚI) --- */}
      <div className="date-filter-group">
        <label htmlFor="start-date">Từ ngày:</label>
        <input 
          type="date" 
          id="start-date"
          className="date-input"
          value={startDate}
          onChange={(e) => onDateChange('startDate', e.target.value)}
        />
        <label htmlFor="end-date">Đến ngày:</label>
        <input 
          type="date" 
          id="end-date"
          className="date-input"
          value={endDate}
          onChange={(e) => onDateChange('endDate', e.target.value)}
        />
      </div>
      
      {/* --- 4. NÚT XUẤT CSV (MỚI) --- */}
      <button 
        className="export-btn"
        onClick={onExportClick}
        disabled={isExporting} // Vô hiệu hóa khi đang xuất
      >
        {isExporting ? 'Đang xuất...' : 'Xuất Báo Cáo'}
      </button>

      {/* ----- KHU VỰC PHÂN TRANG ----- */}
      {/* 5. Thêm marginLeft: 'auto' để đẩy cụm này sang phải */}
      <div className="pagination-controls" style={{ marginLeft: 'auto' }}>
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