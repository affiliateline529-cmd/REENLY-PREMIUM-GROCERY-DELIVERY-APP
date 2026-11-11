import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { format } from 'date-fns';

interface OrdersHistoryProps {
  onOrderClick: (order: Order) => void;
}

const OrdersHistory: React.FC<OrdersHistoryProps> = ({ onOrderClick }) => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!profile) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [profile]);

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return o.status !== 'delivered' && o.status !== 'cancelled';
    return o.status === 'delivered';
  });

  return (
    <div className="pb-32 px-6 pt-4 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#075B3B] text-white' 
                  : 'bg-white text-gray-400 border border-black/[0.03]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#A8D58A] border-t-[#075B3B] rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-black/[0.03]">
          <Package size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No orders found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id}
              onClick={() => onOrderClick(order)}
              className="premium-card p-4 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-14 h-14 bg-[#F5F7F0] rounded-2xl flex items-center justify-center text-[#075B3B]">
                <Package size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 truncate max-w-[140px]">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                   <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {order.createdAt ? format((order.createdAt as any).toDate(), 'MMM dd, HH:mm') : 'Recent'}
                  </div>
                  <span className="font-bold text-[#075B3B]">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
