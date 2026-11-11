import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Welcome to Greenly',
    description: 'Your daily dose of fresh produce, delivered with care to your door.',
    image: '/src/assets/images/onboarding_welcome_1794389086326.jpg'
  },
  {
    id: 2,
    title: 'Fresh & Organic',
    description: 'Directly from local farms to your table. Quality you can taste in every bite.',
    image: '/src/assets/images/onboarding_fresh_1794389086837.jpg'
  },
  {
    id: 3,
    title: 'Fast & Reliable',
    description: 'Easy shopping, fast delivery, and premium quality products at your doorstep.',
    image: '/src/assets/images/onboarding_fast_1794389086556.jpg'
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F5F7F0] z-[90] flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <div className="relative flex-1 overflow-hidden">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-32 left-8 right-8 text-white">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold mb-4"
              >
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-lg leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="bg-white p-8 pb-12 rounded-t-[40px] -mt-12 relative z-10 flex flex-col items-center">
        <div className="flex gap-2 mb-8">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#075B3B]' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex w-full items-center justify-between">
          <button 
            onClick={onComplete}
            className="text-gray-400 font-semibold"
          >
            Skip
          </button>
          
          <button 
            onClick={nextSlide}
            className="w-16 h-16 bg-[#075B3B] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#075B3B]/20"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
