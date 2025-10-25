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
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
