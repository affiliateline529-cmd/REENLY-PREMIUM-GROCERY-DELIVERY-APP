import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="w-48 h-48 bg-[#F5F7F0] rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={80} className="text-[#075B3B] opacity-20" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-[240px]">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button className="btn-primary px-12">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="pb-32 px-6 pt-4 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Cart</h1>
        <p className="text-gray-400 text-sm">{items.length} items in your basket</p>
      </header>

      <div className="space-y-6 mb-12">
        {items.map((item) => (
          <motion.div 
            layout
            key={item.id} 
            className="premium-card p-4 flex gap-4"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-black/[0.03]">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-[#075B3B] font-bold text-sm">
                    ${item.price.toFixed(2)}
                    <span className="text-gray-400 font-medium text-xs">/{item.unit}</span>
                  </p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-black/[0.03]">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm border border-black/[0.03] active:scale-90 transition-transform"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 bg-[#075B3B] text-white rounded-lg flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="font-extrabold text-[#075B3B]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <section className="premium-card p-6 space-y-4">
        <div className="flex justify-between text-gray-500 text-sm font-medium">
          <span>Subtotal</span>
          <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm font-medium">
          <span>Delivery Charges</span>
          <span className="text-emerald-500 font-bold">
            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div className="h-[1px] bg-gray-100" />
        <div className="flex justify-between text-lg">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="font-extrabold text-[#075B3B]">${total.toFixed(2)}</span>
        </div>
      </section>

      {/* Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-[#F5F7F0] via-[#F5F7F0] to-transparent z-40">
        <button 
          onClick={onCheckout}
          className="btn-primary w-full h-14 flex items-center justify-center gap-3 shadow-xl shadow-[#075B3B]/20 max-w-2xl mx-auto"
        >
          Proceed to Checkout
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
