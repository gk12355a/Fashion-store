import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if (path) {
    //   const timer = setTimeout(() => {
    //     navigate(`/${path}`);
    //   }, Number.MAX_SAFE_INTEGER);  // đổi thành 5000 nếu muốn load 5giaay
    //   return () => clearTimeout(timer);
    // }
    if (path) {
      // Không cần timer ở đây
      // Sau khi user bấm nút hoặc sự kiện nào đó:
      const handleContinue = () => {
        navigate(`/${path}`);
      };
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
      <div className="flex flex-col items-center space-y-6">
        {/* Loading spinner với màu theme */}
        <div className="relative">
          <div className="w-16 sm:w-20 aspect-square border-4 border-white/20 border-t-4 border-t-white rounded-full animate-spin shadow-lg"></div>
          {/* Thêm inner glow effect */}
          <div className="absolute inset-0 w-16 sm:w-20 aspect-square border-2 border-transparent border-t-2 border-t-white/40 rounded-full animate-spin animation-delay-150"></div>
        </div>
        
        {/* Loading text với style phù hợp Header */}
        <div className="text-center">
          <h2 className="text-white text-xl sm:text-2xl font-light font-['Helvetica_Neue',_'Arial',_sans-serif] tracking-wider mb-2">
            Đang tải...
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
