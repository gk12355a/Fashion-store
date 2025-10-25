import React from "react";
// import "../Table.css"; // <- Đã XÓA

// --- Định nghĩa các lớp Tailwind Base ---
const tableClass =
  "w-full border-separate border-spacing-0 bg-white rounded-xl overflow-hidden shadow-xl border-2 border-[#7B0323] font-['Helvetica_Neue',_'Arial',_sans-serif] my-5";
const thClass =
  "py-3 px-2 md:py-4 md:px-3 text-center border-b-2 border-[#7B0323] bg-[#7B0323] text-white font-semibold font-['Helvetica_Neue',_'Arial',_sans-serif] text-[15px] md:text-[17px] transition-all duration-300 ease-in-out hover:bg-[#5a0219] hover:text-white";
const trClass =
  "transition-all duration-300 ease-in-out even:bg-gray-50 hover:bg-[#ffeef1] hover:-translate-y-0.5 hover:shadow-md";
const tdClass =
  "py-3 px-2 md:py-4 md:px-3 text-center border-b border-gray-100 text-gray-700 font-normal text-sm md:text-[15px] transition-all duration-300 ease-in-out font-['Helvetica_Neue',_'Arial',_sans-serif]";
const editButtonClass =
  "py-2 px-3 mx-1 text-lg bg-gray-50 text-gray-600 rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-100 hover:text-gray-700 hover:scale-110 hover:shadow-lg hover:shadow-gray-400/30 border border-gray-200 hover:border-gray-300";
const deleteButtonClass =
  "py-2 px-3 mx-1 text-lg bg-red-50 text-[#7B0323] rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#7B0323] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-red-400/30 border border-[#7B0323]/10 hover:border-[#7B0323]/20";
// ------------------------------------

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("vi-VN");
  } catch (e) {
    return dateString;
  }
};

export default function PromotionTable({
  promotions,
  handleEdit,
  handleDelete,
}) {
  return (
    <table className={tableClass}>
      <thead>
        <tr>
          <th className={thClass}>ID</th>
          <th className={thClass}>Tên khuyến mãi</th>
          <th className={thClass}>Loại</th>
          <th className={thClass}>Giảm giá</th>
          <th className={thClass}>Thời hạn</th>
          <th className={thClass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {promotions.length > 0 ? (
          promotions.map((p) => (
            <tr key={p.id} className={trClass}>
              <td className={tdClass}>{p.id}</td>
              <td className={`${tdClass} text-left pl-3 font-medium`}>{p.name}</td>
              <td className={tdClass}>{p.type}</td>
              <td className={`${tdClass} whitespace-nowrap font-semibold text-[#7B0323]`}>
                {p.discountValue?.toLocaleString("vi-VN")}{" "}
                {p.type === "PERCENTAGE" ? "%" : "đ"}
              </td>
              <td className={tdClass}>{formatDate(p.expiryDate)}</td>
              <td className={tdClass}>
                <button
                  className={editButtonClass}
                  onClick={() => handleEdit(p)}
                >
                  ✏️
                </button>
                <button
                  className={deleteButtonClass}
                  onClick={() => handleDelete(p.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="py-4 px-3 text-center text-gray-500 font-['Helvetica_Neue',_'Arial',_sans-serif]">
              Không tìm thấy khuyến mãi
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}