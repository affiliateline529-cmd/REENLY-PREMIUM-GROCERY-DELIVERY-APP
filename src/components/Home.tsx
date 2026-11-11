import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Search, Bell, User as UserIcon, Plus, Star } from 'lucide-react';
import { db } from '../firebase';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
  onProductClick: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onProductClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { profile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsSnapshot = await getDocs(collection(db, 'categories'));
        setCategories(catsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));

        const prodQuery = selectedCategory === 'all' 
          ? query(collection(db, 'products'), limit(20))
          : query(collection(db, 'products'), where('categoryId', '==', selectedCategory), limit(20));
        
        const prodsSnapshot = await getDocs(prodQuery);
        setProducts(prodsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const popularPicks = products.filter(p => p.isPopular);
  const dailyEssentials = products.filter(p => p.isDailyEssential);

  return (
    <div className="pb-24 pt-4 px-6 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-400 text-sm font-medium">Good Morning!</p>
          <h1 className="text-2xl font-bold text-[#075B3B]">{profile?.fullName.split(' ')[0] || 'Guest'}!</h1>
        </div>
        <div className="flex gap-3">
          <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-black/[0.03]">
            <Bell size={20} />
          </button>
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[#A8D58A] shadow-sm">
            <img 
              src={profile?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Greenly"} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#075B3B] transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search fresh groceries..."
          className="input-field pl-12 h-14 bg-white border-transparent shadow-sm hover:shadow-md transition-shadow"
        />
      </div>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Categories</h2>
          <button className="text-[#075B3B] text-xs font-bold uppercase tracking-wider">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center gap-2 min-w-[72px] transition-all ${
                selectedCategory === cat.id ? 'scale-105' : 'opacity-70'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-[#075B3B] text-white border-transparent' 
                  : 'bg-white text-gray-400 border-black/[0.03]'
              }`}>
                <UserIcon size={24} /> {/* Would be real category icons */}
              </div>
              <span className={`text-[11px] font-bold ${
                selectedCategory === cat.id ? 'text-[#075B3B]' : 'text-gray-500'
              }`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Picks */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Popular Picks</h2>
          <button className="text-[#075B3B] text-xs font-bold uppercase tracking-wider">View All</button>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {popularPicks.map((product) => (
            <div key={product.id} className="min-w-[180px] group">
              <div className="premium-card p-4 h-full flex flex-col">
                <div 
                  className="w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-50 relative cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product);
                    }}
                    className="absolute bottom-2 right-2 w-9 h-9 bg-[#075B3B] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#FFB800]">
                      <Star size={12} fill="currentColor" />
                      {product.rating}
                    </div>
                  </div>
                  <p className="text-[#075B3B] font-extrabold text-lg mt-auto">
                    ${product.price.toFixed(2)}
                    <span className="text-gray-400 text-xs font-medium">/{product.unit}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Essentials */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Daily Essentials</h2>
          <button className="text-[#075B3B] text-xs font-bold uppercase tracking-wider">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {dailyEssentials.map((product) => (
            <div key={product.id} className="premium-card p-4 group">
               <div 
                  className="w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-50 relative cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product);
                    }}
                    className="absolute bottom-2 right-2 w-9 h-9 bg-[#075B3B] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 truncate mb-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-[#075B3B] font-extrabold">
                    ${product.price.toFixed(2)}
                    <span className="text-gray-400 text-[10px] font-medium">/{product.unit}</span>
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                    <Star size={12} className="text-[#FFB800]" fill="#FFB800" />
                    {product.rating}
                  </div>
                </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
