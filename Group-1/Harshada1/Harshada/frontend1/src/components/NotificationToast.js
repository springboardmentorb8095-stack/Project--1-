import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enhanced Notification Toast Component
 * ✅ Supports auto-close
 * ✅ Dynamic color (info, success, error)
 * ✅ Smooth entry/exit animation
 * ✅ Mobile-friendly
 */

const NotificationToast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  // 🎨 Dynamic color themes
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-black",
  };

  const icon = {
    success: "✅",
    error: "❌",
    info: "🔔",
    warning: "⚠️",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`fixed bottom-5 right-5 ${colors[type]} text-white px-5 py-3 rounded-xl shadow-xl z-50 flex items-center space-x-2 backdrop-blur-md`}
        >
          <span className="text-xl">{icon[type]}</span>
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
