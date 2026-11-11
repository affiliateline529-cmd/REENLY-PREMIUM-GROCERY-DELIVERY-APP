import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import AuthScreen from './components/AuthScreen';
import Home from './components/Home';
import Cart from './components/Cart';
import OrdersHistory from './components/OrdersHistory';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import AdminDashboard from './components/AdminDashboard';
import { Product, Order } from './types';
import { seedData } from './utils/seedData';

const AppContent: React.FC = () => {
  const { user, profile, loading, isAdmin } = useAuth();
  const { items } = useCart();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('greenly_onboarding_done'));
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    seedData(); // Seed data on app load if needed
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) return <SplashScreen />;

  if (showOnboarding) {
    return <Onboarding onComplete={() => {
      localStorage.setItem('greenly_onboarding_done', 'true');
      setShowOnboarding(false);
    }} />;
  }

  if (!user) {
    return <AuthScreen onSuccess={() => {}} />;
  }

  if (isAdmin && activeTab === 'admin') {
    return (
      <div className="bg-[#F5F7F0] min-h-screen">
        <AdminDashboard />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} cartCount={items.length} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onProductClick={setSelectedProduct} />;
      case 'cart':
        return <Cart onCheckout={() => setIsCheckingOut(true)} />;
      case 'orders':
        return <OrdersHistory onOrderClick={setTrackedOrder} />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onProductClick={setSelectedProduct} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F0]">
      {renderContent()}
      
      {!selectedProduct && !isCheckingOut && !trackedOrder && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          cartCount={items.length} 
        />
      )}

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      )}

      {isCheckingOut && (
        <Checkout 
          onBack={() => setIsCheckingOut(false)} 
          onSuccess={(orderId) => {
            setIsCheckingOut(false);
            setActiveTab('orders');
          }}
        />
      )}

      {trackedOrder && (
        <OrderTracking 
          order={trackedOrder} 
          onBack={() => setTrackedOrder(null)} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
