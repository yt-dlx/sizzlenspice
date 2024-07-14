// components/AnimatedContentWrapper.tsx
"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const AnimatedContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="flex-grow overflow-y-auto bg-[#171717] scrollbar-thin scrollbar-thumb-secondary scrollbar-track-[#1c3029]/30"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContentWrapper;
