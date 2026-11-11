import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Truck, Package, ShoppingBag, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
}

const steps: { status: OrderStatus; label: string; icon: any; time: string }[] = [
  { status: 'pending', label: 'Order Placed', icon: ShoppingBag, time: '11:00 AM' },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2, time: '11:15 AM' },
  { status: 'processing', label: 'Processing', icon: Package, time: '11:45 AM' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, time: 'On the way' },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2, time: 'Done' },
];

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onBack }) => {
  const currentStatusIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="fixed inset-0 bg-[#F5F7F0] z-[90] overflow-y-auto">
      <header className="p-6 bg-white sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.03]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Order Details</h1>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">#{order.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <button className="text-[#075B3B] text-xs font-bold underline uppercase tracking-wider">Help</button>
      </header>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Timeline */}
        <section className="premium-card p-8">
          <div className="space-y-10 relative">
            {/* Connecting Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100" />
            <div 
              className="absolute left-[19px] top-4 w-[2px] bg-[#075B3B] transition-all duration-1000 ease-in-out" 
              style={{ height: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={step.status} className="flex gap-6 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted ? 'bg-[#075B3B] text-white' : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-[#A8D58A]/30 scale-110' : ''}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold transition-colors duration-500 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.time}</span>
                    </div>
                    {isCurrent && (
                      <motion.p 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-gray-500 mt-1"
                      >
                        Your order is currently {step.label.toLowerCase()}...
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Delivery Partner */}
        <section className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#A8D58A] shadow-sm">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" 
                  alt="Rider"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">James Carter</h3>
                <div className="flex items-center gap-1 text-[#FFB800]">
                  <CheckCircle2 size={12} fill="currentColor" />
                  <span className="text-[10px] font-bold">4.9 · Greenly Rider</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-emerald-50 text-[#075B3B] rounded-xl flex items-center justify-center">
                <Phone size={18} />
              </button>
              <button className="w-10 h-10 bg-[#A8D58A]/30 text-[#075B3B] rounded-xl flex items-center justify-center">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl border border-black/[0.03] space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery To</p>
                <p className="text-sm font-medium text-gray-900">{order.deliveryAddress as any}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="premium-card p-6">
          <h2 className="text-lg font-bold mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-500">
                    {item.quantity}x
                  </span>
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-[#075B3B]">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="h-[1px] bg-gray-100 my-2" />
            <div className="flex justify-between text-lg font-extrabold text-[#075B3B]">
              <span>Total Amount</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>
      
      <div className="p-8 pb-12">
        <button className="btn-secondary w-full h-14 flex items-center justify-center gap-3 shadow-lg shadow-[#A8D58A]/20">
          <MapPin size={20} />
          View Live Tracking
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;
