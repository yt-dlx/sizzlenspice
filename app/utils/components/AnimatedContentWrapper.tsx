// components/AnimatedContentWrapper.tsx
"use client";
import { motion } from "framer-motion";

const AnimatedContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="flex-grow overflow-y-auto bg-[#FFF4E9] scrollbar-thin scrollbar-thumb-[#172B25] scrollbar-track-[#FFF4E9]"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContentWrapper;
