import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Users, ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';
import { db } from '../firebase';
import { Order } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        setStats({
          totalUsers: usersSnapshot.size,
          totalOrders: ordersSnapshot.size,
          totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
          pendingOrders: orders.filter(o => o.status === 'pending').length
        });
        
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const statCards = [
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) return <div className="p-8 text-center">Loading admin data...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your grocery marketplace performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-3xl p-6 shadow-sm border border-black/[0.03]">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl overflow-hidden border border-black/[0.03]">
            <div className="p-6 border-b border-black/[0.03] flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <button className="text-[#075B3B] text-xs font-bold uppercase tracking-wider">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="px-6 py-4 font-bold">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 font-extrabold text-[#075B3B]">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="text-xs font-bold border-none bg-gray-50 rounded-lg p-1 focus:ring-0"
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl p-6 h-full flex flex-col border border-black/[0.03]">
            <h2 className="text-lg font-bold mb-6">Sales Growth</h2>
            <div className="flex-1 flex items-end gap-2 pb-4">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-[#A8D58A] rounded-t-lg transition-all duration-1000" 
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-black/[0.03] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Rate</p>
                <p className="text-xl font-extrabold text-emerald-500">+14.5%</p>
              </div>
              <TrendingUp className="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
