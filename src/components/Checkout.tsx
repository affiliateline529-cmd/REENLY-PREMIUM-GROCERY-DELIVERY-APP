import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin, CreditCard, Clock } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onSuccess }) => {
  const { profile } = useAuth();
  const { items, total, subtotal, deliveryFee, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(profile?.savedAddresses?.[0]?.street || '123 Green Street, North Area');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const handlePlaceOrder = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const orderData = {
        userId: profile.uid,
        items,
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
        deliveryAddress: address,
        paymentMethod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      onSuccess(docRef.id);
    } catch (err) {
      console.error("Error placing order:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F5F7F0] z-[85] overflow-y-auto pb-32">
      <header className="p-6 bg-white sticky top-0 z-10 flex items-center gap-4 border-b border-black/[0.03]">
        <button onClick={onBack} className="text-gray-900"><ArrowRight className="rotate-180" /></button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </header>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Delivery Info */}
        <section className="premium-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#A8D58A]/30 text-[#075B3B] rounded-xl flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-bold">Delivery Address</h2>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-black/[0.03]">
            <p className="font-bold text-gray-900 mb-1">{profile?.fullName}</p>
            <p className="text-gray-500 text-sm">{address}</p>
            <button className="text-[#075B3B] text-xs font-bold mt-4 uppercase tracking-wider">Change Address</button>
          </div>
        </section>

        {/* Payment Method */}
        <section className="premium-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#A8D58A]/30 text-[#075B3B] rounded-xl flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <h2 className="text-lg font-bold">Payment Method</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                paymentMethod === 'cod' 
                  ? 'border-[#075B3B] bg-[#075B3B]/5' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <CheckCircle2 size={20} className={paymentMethod === 'cod' ? 'text-[#075B3B]' : 'text-gray-200'} />
              <span className="font-bold text-sm">Cash on Delivery</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                paymentMethod === 'card' 
                  ? 'border-[#075B3B] bg-[#075B3B]/5' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <CheckCircle2 size={20} className={paymentMethod === 'card' ? 'text-[#075B3B]' : 'text-gray-200'} />
              <span className="font-bold text-sm">Online Payment</span>
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="premium-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#A8D58A]/30 text-[#075B3B] rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-bold">Estimated Delivery</h2>
          </div>
          <p className="text-gray-500 text-sm">30 - 45 minutes · Express Delivery</p>
          
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-gray-500 text-sm font-medium">
              <span>Items ({items.length})</span>
              <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm font-medium">
              <span>Delivery Fee</span>
              <span className="text-emerald-500 font-bold">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="h-[1px] bg-gray-100" />
            <div className="flex justify-between text-xl">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-[#075B3B]">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white border-t border-black/[0.05] z-50 safe-bottom">
        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="btn-primary w-full h-14 flex items-center justify-center gap-3 shadow-xl shadow-[#075B3B]/20 max-w-2xl mx-auto"
        >
          {loading ? 'Placing Order...' : 'Place Order Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
