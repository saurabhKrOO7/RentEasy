import React from "react";
import { CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const Loader = ({ isLoading, size }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-lg z-[9999] w-screen h-screen"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 bg-white/20 backdrop-blur-2xl rounded-xl shadow-2xl"
          >
            <CircularProgress size={size} thickness={5} color="primary" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
