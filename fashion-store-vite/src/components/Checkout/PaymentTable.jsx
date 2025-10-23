import React from "react";
// import "../Table.css"; // <- Đã XÓA

// --- Định nghĩa các lớp Tailwind Base ---
const tableClass =
  "w-full border-separate border-spacing-0 bg-white rounded-xl overflow-hidden shadow-lg border-2 border-[#ffd1dc] font-poppins my-5";
const thClass =
  "py-3 px-2 md:py-4 md:px-3 text-center border-b-2 border-[#b8cf9b] bg-[#d4e6c4] text-gray-800 font-semibold font-playfair text-[15px] md:text-[17px] transition-all duration-300 ease-in-out hover:bg-[#9bb47a] hover:text-white";
const trClass =
  "transition-all duration-300 ease-in-out even:bg-gray-50 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-md";
const tdClass =
  "py-3 px-2 md:py-4 md:px-3 text-center border-b border-gray-100 text-gray-700 font-normal text-sm md:text-[15px] transition-all duration-300 ease-in-out";
const editButtonClass =
  "py-2 px-3 mx-1 text-lg bg-green-100 text-green-700 rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-green-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-green-600/30";
const deleteButtonClass =
  "py-2 px-3 mx-1 text-lg bg-red-100 text-red-600 rounded-lg transition-all duration-300 ease-in-out cursor-pointer hover:bg-red-700 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-red-700/30";
// ------------------------------------

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch (e) {
    return dateTimeString;
  }
};

export default function PaymentTable({ payments, handleEdit, handleDelete }) {
  return (
    <table className={tableClass}>
      <thead>
        <tr>
          <th className={thClass}>ID</th>
          <th className={thClass}>Mã đơn</th>
          <th className={thClass}>Phương thức</th>
          <th className={thClass}>Số tiền (VNĐ)</th>
          <th className={thClass}>Ngày TT</th>
          <th className={thClass}>Nhân viên TT</th>
          <th className={thClass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {payments.length > 0 ? (
          payments.map((p) => (
            <tr key={p.id} className={trClass}>
              <td className={tdClass}>{p.id}</td>
              <td className={tdClass}>{p.orderId}</td>
              <td className={tdClass}>{p.paymentMethod}</td>
              <td className={`${tdClass} whitespace-nowrap`}>
                {p.amount.toLocaleString("vi-VN")}
              </td>
              <td className={`${tdClass} whitespace-nowrap`}>
                {formatDateTime(p.paymentDate)}
              </td>
              <td className={tdClass}>{p.staff?.name || "N/A"}</td>
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
            <td colSpan="7" className="py-4 px-3 text-center text-gray-500">
              Không tìm thấy thanh toán
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
