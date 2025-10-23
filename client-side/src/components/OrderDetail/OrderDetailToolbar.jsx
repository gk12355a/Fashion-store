import React from 'react';
import '../Product/ProductToolbar.css'; // Dùng chung CSS với các Toolbar khác

export default function OrderDetailToolbar({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  currentPage,
  totalPages,
  setCurrentPage
}) {

  // Xử lý khi chọn cách sắp xếp từ dropdown
  const handleSortChange = (e) => {
    const value = e.target.value; // Giá trị dạng 'field,order' (ví dụ: 'productId,asc')
    if (value) {
      const [field, order] = value.split(','); // Tách field và order
      setSortField(field);
      setSortOrder(order);
    }
  };

  // Lấy giá trị hiện tại cho dropdown (để hiển thị đúng lựa chọn đang active)
  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'id,asc'; // Mặc định sort theo ID tăng dần

  // Xử lý nút Lùi trang
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Xử lý nút Tiến trang
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
        {/* Dropdown chọn cách sắp xếp */}
        <select
          value={currentSortValue}
          onChange={handleSortChange}
          className="sort-select active-select" // Class để style (có thể dùng border đỏ như trước)
        >
          <option value="id,asc">ID (Tăng)</option>
          <option value="id,desc">ID (Giảm)</option>
          <option value="productId,asc">Mã SP (Tăng)</option>
          <option value="productId,desc">Mã SP (Giảm)</option>
          <option value="quantity,desc">Số lượng (Nhiều-Ít)</option>
          <option value="quantity,asc">Số lượng (Ít-Nhiều)</option>
          <option value="unitPrice,desc">Giá (Cao-Thấp)</option>
          <option value="unitPrice,asc">Giá (Thấp-Cao)</option>
        </select>
      </div>

      {/* ----- KHU VỰC PHÂN TRANG ----- */}
      {/* style={{ marginLeft: 'auto' }} giúp đẩy cụm này sang phải */}
      <div className="pagination-controls" style={{ marginLeft: 'auto' }}>
        {/* Hiển thị trang hiện tại / tổng số trang */}
        <span className="page-info">{totalPages > 0 ? currentPage : 0}/{totalPages}</span>
        {/* Nút lùi */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || totalPages === 0} // Vô hiệu hóa nếu ở trang 1 hoặc không có trang nào
          className="page-nav"
        >
          &lt; {/* Ký tự mũi tên trái */}
        </button>
        {/* Nút tiến */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0} // Vô hiệu hóa nếu ở trang cuối hoặc không có trang nào
          className="page-nav"
        >
          &gt; {/* Ký tự mũi tên phải */}
        </button>
      </div>
    </div>
  );
}