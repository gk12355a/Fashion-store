// src/hooks/useCountUpAnimation.js
import { useState, useEffect, useRef } from 'react';

function useCountUpAnimation(endValue, duration = 2000) {
  const [count, setCount] = useState(0);
  const startValueRef = useRef(0); // Dùng ref để tránh reset khi re-render
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const step = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);

    const currentCount = startValueRef.current + (endValue - startValueRef.current) * easedProgress;
    setCount(currentCount);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(step);
    } else {
        // Đảm bảo giá trị cuối cùng chính xác
         setCount(endValue);
    }
  };

  useEffect(() => {
    // Reset khi endValue thay đổi
    startValueRef.current = 0; // Bắt đầu lại từ 0
    startTimeRef.current = null; // Reset thời gian bắt đầu
    setCount(0); // Hiển thị 0 ban đầu

    // Bỏ qua nếu endValue chưa có hoặc là 0
    if (endValue > 0) {
        animationFrameRef.current = requestAnimationFrame(step);
    } else {
        setCount(endValue); // Hiển thị ngay nếu là 0 hoặc âm
    }


    // Cleanup function để hủy animation nếu component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endValue, duration]); // Chỉ chạy lại khi endValue hoặc duration thay đổi

  return count;
}

export default useCountUpAnimation;