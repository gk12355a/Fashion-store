// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api"; // Import api.js của bạn
import { Link } from "react-router-dom";
import { Line, Doughnut, Bar } from "react-chartjs-2"; // Import các loại biểu đồ
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Thêm BarElement
  ArcElement, // Thêm ArcElement
  Title,
  Tooltip,
  Legend,
  Filler, // Thêm Filler cho biểu đồ line area
} from "chart.js";
import useCountUpAnimation from "../hooks/useCountUpAnimation"; // Import custom hook
import { toast } from "react-toastify"; // <-- THÊM DÒNG NÀY
import Loading from "../components/Loading"; // <-- 1. IMPORT COMPONENT LOADING

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Component StatsCard (Tạo component con cho thẻ thống kê) ---
function StatsCard({
  title,
  value,
  changePercent,
  icon,
  iconBgColor,
  iconColor,
  borderColor,
  formatValue,
}) {
  const animatedValue = useCountUpAnimation(value || 0);
  const displayValue = formatValue
    ? formatValue(animatedValue)
    : Math.floor(animatedValue).toLocaleString();
  const changeColor =
    changePercent == null
      ? "text-gray-500"
      : changePercent >= 0
      ? "text-green-600"
      : "text-red-600";
  const changePrefix =
    changePercent == null ? "" : changePercent >= 0 ? "+" : "";
  const displayChange =
    changePercent == null
      ? "N/A"
      : `${changePrefix}${changePercent.toFixed(1)}%`;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${borderColor} hover:shadow-xl transition-all duration-300 font-['Helvetica_Neue',_'Arial',_sans-serif]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#7B0323] opacity-80">{title}</p>
          <p className="text-3xl font-bold text-[#7B0323]">{displayValue}</p>
          <p className={`text-sm ${changeColor} mt-1`}>
            <span className="font-medium">{displayChange}</span> so với tháng
            trước
          </p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-full shadow-md`}>
          {React.cloneElement(icon, { className: `w-8 h-8 ${iconColor}` })}
        </div>
      </div>
    </div>
  );
}
// -----------------------------------------------------------------

// --- Component Chính HomePage ---
export default function HomePage() {
  // State lưu dữ liệu từ API
  const [summaryData, setSummaryData] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [weeklyCustomerData, setWeeklyCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- 2. ADD STATE FOR DATE INPUTS ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false); // State for loading button
  // ------------------------------------

  // useEffect để gọi tất cả API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi song song các API
        const [summaryRes, revenueRes, categoryRes, customerRes] =
          await Promise.all([
            api.get("/statistics/summary"),
            api.get("/statistics/revenue/monthly"), // Mặc định lấy năm hiện tại
            api.get("/statistics/products/by-category"),
            api.get("/statistics/customers/new/weekly"), // Mặc định lấy 8 tuần
          ]);

        setSummaryData(summaryRes.data);
        setMonthlyRevenueData(revenueRes.data);
        setCategoryData(categoryRes.data);
        setWeeklyCustomerData(customerRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
        // Không cần toast ở đây vì có thể làm phiền nếu trang tự refresh
        // setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chỉ chạy 1 lần khi mount
  // --- 3. ADD handleExport FUNCTION ---
  const handleExport = async () => {
    // Basic validation
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast.error("Ngày bắt đầu không được sau ngày kết thúc.");
      return;
    }

    setIsExporting(true); // Set loading state for button

    try {
      const response = await api.get("/orders/export", {
        params: { startDate, endDate }, // Send dates as YYYY-MM-DD
        responseType: "blob", // Important: Ask axios for the raw data blob
      });

      // Extract filename from Content-Disposition header (more robust parsing)
      const headerLine = response.headers["content-disposition"];
      let filename = `BaoCao_DonHang_${startDate}_den_${endDate}.csv`; // Default
      if (headerLine) {
        const utf8FilenameMatch = headerLine.match(
          /filename\*?=UTF-8''([^;]+)/i
        );
        if (utf8FilenameMatch && utf8FilenameMatch[1]) {
          filename = decodeURIComponent(utf8FilenameMatch[1]);
        } else {
          const asciiFilenameMatch = headerLine.match(/filename="([^"]+)"/i);
          if (asciiFilenameMatch && asciiFilenameMatch[1]) {
            filename = asciiFilenameMatch[1]; // Fallback for simple filenames
          }
        }
      }

      // Create a Blob URL and trigger download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv; charset=UTF-8" })
      ); // Ensure correct MIME type and charset
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Xuất báo cáo thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất báo cáo:", error);
      // Attempt to read error message if the response is JSON within a Blob
      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const errorJson = JSON.parse(reader.result);
            toast.error(
              `Lỗi khi xuất báo cáo: ${errorJson.error || "Lỗi không xác định"}`
            );
          } catch (parseError) {
            toast.error("Lỗi khi xuất báo cáo. Không thể đọc chi tiết lỗi.");
          }
        };
        reader.readAsText(error.response.data);
      } else {
        toast.error(
          "Lỗi khi xuất báo cáo. Vui lòng kiểm tra lại ngày hoặc thử lại."
        );
      }
    } finally {
      setIsExporting(false); // Reset loading state
    }
  };
  // --- Cấu hình dữ liệu cho các biểu đồ ---

  // Biểu đồ Doanh thu tháng
  const revenueChartData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Doanh Thu (VNĐ)", // Sửa label
        // Dữ liệu lấy từ state, chia cho 1 triệu để giống mẫu
        data:
          monthlyRevenueData?.monthlyRevenue.map((rev) => rev / 1000000) || [],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  const revenueChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => value + "M" }, // Thêm 'M' cho triệu
      },
    },
  };

  // Biểu đồ Danh mục sản phẩm
  const categoryChartData = {
    labels: categoryData?.map((cat) => cat.category) || [], // Lấy tên category làm nhãn
    datasets: [
      {
        data: categoryData?.map((cat) => cat.count) || [], // Lấy số lượng làm dữ liệu
        backgroundColor: [
          "#ec4899",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
          "#6b7280",
        ], // Thêm màu nếu cần
      },
    ],
  };
  const categoryChartOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
  };

  // Biểu đồ Khách hàng mới theo tuần
  // Tạo nhãn động cho 8 tuần gần nhất (ví dụ)
  const weeklyLabels =
    weeklyCustomerData?.map((_, index, arr) => `Tuần ${arr.length - index}`) ||
    [];
  weeklyLabels.reverse(); // Đảo ngược để tuần mới nhất ở cuối

  const customersChartData = {
    labels: weeklyLabels, // Nhãn tuần
    datasets: [
      {
        label: "Khách hàng mới",
        data: weeklyCustomerData || [], // Dữ liệu số lượng từ API
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
      },
    ],
  };
  const customersChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  // --- JSX Rendering ---

  // Lớp gốc cho page (lấy padding từ .main-content)
  const pageClass = "p-5 font-['Helvetica_Neue',_'Arial',_sans-serif]";

  // Hiển thị loading hoặc lỗi
  if (loading) {
    // <-- 2. THAY THẾ DIV BẰNG COMPONENT LOADING -->
    return <Loading />;
  }
  if (error) {
    return <div className={`${pageClass} text-[#7B0323] text-center text-lg font-medium`}>{error}</div>;
  }

  // Hàm format tiền tệ (Ví dụ: 2.4 tỷ, 500 triệu)
  const formatRevenue = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return "0 VNĐ";
    if (numValue >= 1e9) {
      // Tỷ
      return (numValue / 1e9).toFixed(1) + " tỷ VNĐ";
    }
    if (numValue >= 1e6) {
      // Triệu
      return (numValue / 1e6).toFixed(0) + " Tr VNĐ";
    }
    if (numValue >= 1e3) {
      // Ngàn
      return (numValue / 1e3).toFixed(0) + " k VNĐ";
    }
    return numValue.toLocaleString() + " VNĐ";
  };

  return (
    <div className={pageClass}>
      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Tổng Sản Phẩm"
          // Truyền giá trị từ summaryData
          value={summaryData?.totalProducts?.currentValue}
          changePercent={summaryData?.totalProducts?.changePercent}
          borderColor="border-[#7B0323]"
          iconBgColor="bg-gradient-to-br from-[#7B0323] to-[#5a0219]"
          iconColor="text-white"
          icon={
            // SVG Icon
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          }
          // Không cần format đặc biệt, dùng toLocaleString mặc định
        />
        <StatsCard
          title="Tổng Doanh Thu (Tháng)" // Rõ ràng hơn là doanh thu tháng này
          value={summaryData?.totalRevenue?.currentValue}
          changePercent={summaryData?.totalRevenue?.changePercent}
          borderColor="border-[#7B0323]"
          iconBgColor="bg-gradient-to-br from-[#7B0323] to-[#5a0219]"
          iconColor="text-white"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          }
          formatValue={formatRevenue} // Dùng hàm format tiền tệ
        />
        <StatsCard
          title="Tổng Khách Hàng"
          value={summaryData?.totalCustomers?.currentValue}
          changePercent={summaryData?.totalCustomers?.changePercent}
          borderColor="border-[#7B0323]"
          iconBgColor="bg-gradient-to-br from-[#7B0323] to-[#5a0219]"
          iconColor="text-white"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          }
        />
      </div>

      {/* --- Charts Section --- */}
      <div className="flex flex-wrap gap-6">
        {/* Doanh Thu Theo Tháng */}
        <div className="flex-1 min-w-[300px] bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-[#7B0323] mb-6 border-b border-gray-200 pb-3">
            Doanh Thu Theo Tháng (
            {monthlyRevenueData?.year || new Date().getFullYear()})
          </h3>
          {monthlyRevenueData && (
            <Line data={revenueChartData} options={revenueChartOptions} />
          )}
        </div>

        {/* Danh Mục Sản Phẩm */}
        <div className="flex-1 min-w-[300px] bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-[#7B0323] mb-6 border-b border-gray-200 pb-3 w-full text-center">
            Danh Mục Sản Phẩm
          </h3>
          <div className="w-full max-w-[400px]">
            {categoryData && (
              <Doughnut
                data={categoryChartData}
                options={categoryChartOptions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Khách Hàng Mới Theo Tuần */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 w-[640px] h-[400px] border border-gray-100 hover:shadow-xl transition-all duration-300 mt-6">
        <h3 className="text-xl font-bold text-[#7B0323] mb-6 border-b border-gray-200 pb-3">
          Khách Hàng Mới Theo Tuần
        </h3>
        {/* Component Bar */}
        {weeklyCustomerData && (
          <Bar data={customersChartData} options={customersChartOptions} />
        )}
      </div>
      {/* --- 4. ADD EXPORT SECTION --- */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-[#7B0323] mb-6 border-b border-gray-200 pb-3">
          Xuất Báo Cáo Đơn Hàng (CSV)
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-[#7B0323] mb-2"
            >
              Từ ngày:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-[#7B0323] focus:ring-[#7B0323] focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 transition-all duration-300"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-[#7B0323] mb-2"
            >
              Đến ngày:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-[#7B0323] focus:ring-[#7B0323] focus:ring-2 focus:ring-opacity-50 sm:text-sm p-3 transition-all duration-300"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting} // Disable button when exporting
            className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
              isExporting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#7B0323] to-[#5a0219] hover:from-[#5a0219] hover:to-[#7B0323] focus:ring-[#7B0323] transform hover:scale-105"
            }`}
          >
            {isExporting ? "Đang xuất..." : "Xuất Báo Cáo"}
          </button>
        </div>
      </div>
      {/* --------------------------- */}

      {/* ----- ⭐ THÊM PHẦN FEATURES Ở ĐÂY ----- */}
      <div className="mt-12 pt-8 border-t-2 border-[#7B0323] border-opacity-20">
        <h2 className="text-3xl font-bold text-center text-[#7B0323] mb-8 tracking-wide">
          Tính năng quản lý
        </h2>
        {/* Container cho các card, chia cột và tạo khoảng cách */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Gọi component Feature cho từng mục */}
          <Feature
            icon="👕"
            title="Quản lý sản phẩm"
            link="/sanpham"
            desc="Quản lý danh sách sản phẩm thời trang, thêm mới, sửa thông tin, giá cả và trạng thái có sẵn."
          />
          <Feature
            icon="👥"
            title="Quản lý khách hàng"
            link="/khachhang"
            desc="Lưu trữ thông tin khách hàng, điểm tích lũy, loại thành viên và lịch sử mua hàng."
          />
          <Feature
            icon="📦"
            title="Quản lý đơn hàng"
            link="/donhang"
            desc="Theo dõi đơn hàng, trạng thái, tính toán tổng tiền và hóa đơn."
          />
          <Feature
            icon="📋"
            title="Chi tiết đơn hàng"
            link="/chitietdonhang" // Đổi title
            desc="Quản lý chi tiết từng đơn hàng, sản phẩm trong đơn, số lượng và giá trị."
          />
          <Feature
            icon="👔"
            title="Quản lý nhân viên"
            link="/nhanvien"
            desc="Quản lý thông tin nhân viên, ca làm việc, chức vụ và lương thưởng."
          />
          <Feature
            icon="💳"
            title="Quản lý thanh toán"
            link="/thanhtoan"
            desc="Xử lý thanh toán, theo dõi doanh thu, hóa đơn và các khoản chi."
          />
          <Feature
            icon="🎁"
            title="Quản lý khuyến mãi"
            link="/khuyenmai"
            desc="Tạo và quản lý chương trình khuyến mãi, mã giảm giá và ưu đãi đặc biệt."
          />
          {/* Bạn có thể thêm Feature card khác nếu cần */}
        </div>
      </div>
    </div>
  );
}
// ----- ⭐ ĐỊNH NGHĨA COMPONENT FEATURE -----
// (Đặt ở cuối file hoặc import từ file riêng)
function Feature({ icon, title, desc, link }) {
  return (
    // Card styling: Nền trắng, bo góc, đổ bóng, padding, căn giữa, border top màu đỏ đậm
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-[#7B0323] hover:shadow-2xl hover:transform hover:scale-105 transition-all duration-300 font-['Helvetica_Neue',_'Arial',_sans-serif] border border-gray-100">
      {/* Icon */}
      <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">{icon}</div>
      {/* Title */}
      <h2 className="font-bold text-lg text-[#7B0323] mb-3 tracking-wide">{title}</h2>
      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{desc}</p>
      {/* Link */}
      <Link
        to={link}
        className="mt-auto inline-block bg-gradient-to-r from-[#7B0323] to-[#5a0219] hover:from-[#5a0219] hover:to-[#7B0323] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wide"
      >
        Xem chi tiết →
      </Link>
    </div>
  );
}
// ---------------------------------------------