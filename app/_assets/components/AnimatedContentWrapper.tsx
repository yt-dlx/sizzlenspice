// app/_assets/components/AnimatedContentWrapper.tsx
"use client";
import { motion } from "framer-motion";
const AnimatedContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-primary/30"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContentWrapper;
