import React from "react";
import { motion } from "motion/react";

export const LoadingSpinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div id="loading-spinner-container" className="flex items-center justify-center p-4">
      <motion.div
        id="loading-spinner"
        className={`${sizeClasses[size]} border-pink-200 border-t-accent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear"
        }}
      />
    </div>
  );
};
