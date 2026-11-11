import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 mb-6">
          <img 
            src="/src/assets/images/brand_logo_greenly_1794389085233.jpg" 
            alt="Greenly Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl font-bold text-[#075B3B] tracking-tight"
        >
          GREENLY
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-400 mt-2 font-medium tracking-wide uppercase text-xs"
        >
          Good Food. Good Life.
        </motion.p>
      </motion.div>
      <div className="absolute bottom-12">
        <div className="w-8 h-8 border-4 border-[#A8D58A] border-t-[#075B3B] rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default SplashScreen;
