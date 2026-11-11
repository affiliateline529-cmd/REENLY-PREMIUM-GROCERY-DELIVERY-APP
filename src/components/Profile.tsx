import React from 'react';
import { Settings, LogOut, ChevronRight, ShoppingBag, Heart, MapPin, CreditCard, Bell, Shield, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { profile, logout } = useAuth();

  const sections = [
    {
      title: 'Activity',
      items: [
        { icon: ShoppingBag, label: 'My Orders', color: 'text-blue-500', bg: 'bg-blue-50' },
        { icon: Heart, label: 'My Wishlist', color: 'text-red-500', bg: 'bg-red-50' },
        { icon: MapPin, label: 'Saved Addresses', color: 'text-orange-500', bg: 'bg-orange-50' },
        { icon: CreditCard, label: 'Payment Methods', color: 'text-emerald-500', bg: 'bg-emerald-50' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: Bell, label: 'Notifications', color: 'text-purple-500', bg: 'bg-purple-50' },
        { icon: Shield, label: 'Security', color: 'text-slate-500', bg: 'bg-slate-50' },
        { icon: Info, label: 'Help & Support', color: 'text-sky-500', bg: 'bg-sky-50' },
      ]
    }
  ];

  return (
    <div className="pb-32 px-6 pt-4 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex flex-col items-center mb-10">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[32px] overflow-hidden border-4 border-white shadow-xl rotate-3">
            <img 
              src={profile?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Greenly"} 
              alt="Profile"
              className="w-full h-full object-cover -rotate-3 scale-110"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#075B3B] text-white rounded-2xl flex items-center justify-center border-4 border-[#F5F7F0] shadow-lg">
            <Settings size={18} />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{profile?.fullName}</h1>
        <p className="text-gray-400 font-medium text-sm mt-1">{profile?.email}</p>
        
        <div className="flex gap-4 mt-8 w-full">
          <div className="premium-card flex-1 p-4 text-center">
            <p className="text-2xl font-extrabold text-[#075B3B]">12</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Orders</p>
          </div>
          <div className="premium-card flex-1 p-4 text-center">
            <p className="text-2xl font-extrabold text-[#075B3B]">24</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Wishlist</p>
          </div>
        </div>
      </header>

      {/* Menu Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">
              {section.title}
            </h2>
            <div className="premium-card overflow-hidden">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={item.label}
                    className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${
                      idx !== section.items.length - 1 ? 'border-b border-black/[0.03]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                        <Icon size={20} />
                      </div>
                      <span className="font-bold text-gray-900">{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button 
          onClick={logout}
          className="w-full premium-card p-5 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 transition-colors mt-8"
        >
          <LogOut size={20} />
          <span className="font-bold">Logout Account</span>
        </button>

        <p className="text-center text-gray-300 text-[10px] font-bold uppercase tracking-widest mt-12 pb-8">
          Greenly v1.0.0 · Premium Grocery Delivery
        </p>
      </div>
    </div>
  );
};

export default Profile;
