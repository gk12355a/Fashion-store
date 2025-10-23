import React from 'react';
// import '../Product/ProductToolbar.css'; // <- ĐÃ XÓA

// --- Định nghĩa lớp Tailwind ---
const toolbarClass = "flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg mb-5 flex-wrap gap-4";
const sortOptionsClass = "flex items-center gap-2.5 flex-wrap";
const sortLabelClass = "text-[15px] font-medium text-gray-800 mr-1.5";
const baseFormControlClass = "py-2 px-3.5 border border-gray-300 bg-white rounded-md cursor-pointer text-sm transition-all duration-200 ease-in-out text-gray-800 hover:border-gray-400 hover:bg-gray-50";
// const baseSortBtnClass = `${baseFormControlClass}`;
const baseSortSelectClass = `${baseFormControlClass} pr-8`;
// const activeSortBtnClass = "bg-red-600 text-white border-red-600 font-semibold";
const activeSortSelectClass = "border-red-600 font-semibold ring-2 ring-red-600/20";
const paginationClass = "flex items-center gap-2";
const pageInfoClass = "text-sm font-semibold text-gray-800 bg-white py-2 px-3 rounded-md border border-gray-300";
const pageNavClass = "py-2 px-3 border border-gray-300 bg-white rounded-md cursor-pointer font-semibold disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200";
// -----------------------------

export default function StaffToolbar({
  sortField, sortOrder, setSortField, setSortOrder,
  currentPage, totalPages, setCurrentPage
}) {

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [field, order] = value.split(',');
      setSortField(field); setSortOrder(order);
    }
  };
  const currentSortValue = sortField ? `${sortField},${sortOrder}` : 'name,asc';
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  return (
    <div className={toolbarClass}>
      {/* --- Sắp xếp --- */}
      <div className={sortOptionsClass}>
        <span className={sortLabelClass}>Sắp xếp theo</span>
        <select 
          value={currentSortValue} 
          onChange={handleSortChange} 
          className={`${baseSortSelectClass} ${activeSortSelectClass}`}
        >
          <option value="name,asc">Tên (A-Z)</option>
          <option value="name,desc">Tên (Z-A)</option>
          <option value="salary,desc">Lương (Cao-Thấp)</option>
          <option value="salary,asc">Lương (Thấp-Cao)</option>
          <option value="workShift,asc">Ca làm việc</option>
        </select>
      </div>
      {/* --- Phân Trang --- */}
      <div className={`${paginationClass} ml-auto`}> {/* Thay style bằng class */}
        <span className={pageInfoClass}>{totalPages > 0 ? currentPage : 0}/{totalPages}</span>
        <button onClick={handlePrev} disabled={currentPage === 1 || totalPages === 0} className={pageNavClass}>&lt;</button>
        <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} className={pageNavClass}>&gt;</button>
      </div>
    </div>
  );
}