import React from 'react';
import { Home, ShoppingCart, ListOrdered, User } from 'lucide-react';
import { clsx } from 'clsx';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartCount }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ListOrdered },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, count: cartCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/[0.05] z-50 safe-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "relative flex flex-col items-center justify-center w-full h-full transition-all duration-300",
                isActive ? "text-[#075B3B]" : "text-gray-400"
              )}
            >
              <Icon size={24} className={clsx("transition-transform duration-300", isActive && "scale-110")} />
              <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute top-2 right-1/2 translate-x-4 bg-[#A8D58A] text-[#075B3B] text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-[#075B3B] rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
