import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[80] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <button 
          onClick={onBack}
          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-md border border-black/[0.03]"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border border-black/[0.03] transition-colors ${
              isFavorite ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-gray-400'
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-md border border-black/[0.03]">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      {/* Image Section */}
      <div className="relative h-[45%] bg-[#F5F7F0] flex items-center justify-center p-12 pt-24">
        <motion.img 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 bg-white rounded-t-[40px] -mt-10 p-8 pt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="bg-[#A8D58A]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Star size={16} className="text-[#075B3B]" fill="currentColor" />
            <span className="text-[#075B3B] font-bold">{product.rating}</span>
            <span className="text-gray-400 text-xs font-medium">({product.reviewsCount})</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-wider">
          {product.categoryId} · Fresh Produce
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
          <p className="text-gray-500 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-black/[0.03]">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm border border-black/[0.03] active:scale-90 transition-transform"
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-bold w-6 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-[#075B3B] rounded-xl flex items-center justify-center text-white shadow-md active:scale-90 transition-transform"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Price</p>
            <p className="text-3xl font-extrabold text-[#075B3B]">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="p-8 bg-white border-t border-black/[0.05] safe-bottom">
        <button 
          onClick={() => {
            handleAddToCart();
            onBack();
          }}
          className="btn-primary w-full h-14 flex items-center justify-center gap-3 shadow-xl shadow-[#075B3B]/20"
        >
          Add to Cart
          <div className="w-[1px] h-4 bg-white/30" />
          <span>${(product.price * quantity).toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
