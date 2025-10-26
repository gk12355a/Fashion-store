import React from "react";


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

export default function CustomerTable({ customers, handleEdit, handleDelete }) {
  return (
    <table className={tableClass}>
      <thead>
        <tr>
          <th className={thClass}>ID</th>
          <th className={thClass}>Tên khách hàng</th>
          <th className={thClass}>SĐT</th>
          <th className={thClass}>Email</th>
          <th className={thClass}>Loại thành viên</th>
          <th className={thClass}>Điểm thưởng</th>
          <th className={thClass}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {customers.length > 0 ? (
          customers.map((c) => (
            <tr key={c.id} className={trClass}>
              <td className={tdClass}>{c.id}</td>
              <td className={`${tdClass} text-left pl-3`}>{c.name}</td>
              <td className={tdClass}>{c.phoneNumber}</td>
              <td className={tdClass}>{c.email}</td>
              <td className={tdClass}>{c.membershipType}</td>
              <td className={tdClass}>{c.rewardPoints}</td>
              <td className={tdClass}>
                <button
                  className={editButtonClass}
                  onClick={() => handleEdit(c)}
                >
                  ✏️
                </button>
                <button
                  className={deleteButtonClass}
                  onClick={() => handleDelete(c.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="py-4 px-3 text-center text-gray-500">
              Không tìm thấy khách hàng
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
