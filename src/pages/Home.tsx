import { Link } from 'react-router-dom';
import { Coins, Database, TrendingUp, ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-white page-transition">
      {/* Black curved header */}
      <div
        className="relative w-full flex flex-col items-center pt-10 pb-12"
        style={{
          backgroundColor: '#0A0A0A',
          borderRadius: '0 0 50% 50% / 0 0 50px 50px'
        }}>

        {/* DMY Logo */}
        <div className="text-center mt-4">
          <img src="/logo-main.png" alt="DMY Jewellers" className="w-48 md:w-64 h-auto drop-shadow-xl" />
        </div>
      </div>

      {/* Grid of 4 categories */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-2 gap-4">

          {/* Scheme */}
          <Link to="/scheme" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-gray-100 transition-transform active:scale-[0.98]">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <Coins size={32} color="#C9A84C" />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg leading-tight">Gold Savings<br />Scheme</h3>
          </Link>

          {/* Gold Coins */}
          <Link to="/gold-bars" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-gray-100 transition-transform active:scale-[0.98]">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <Database size={32} color="#C9A84C" />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg leading-tight">Gold Bars &<br />Coins</h3>
          </Link>

          {/* Trending Categories */}
          <Link to="/categories" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-gray-100 transition-transform active:scale-[0.98]">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <TrendingUp size={32} color="#C9A84C" />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg leading-tight">Trending<br />Categories</h3>
          </Link>

          {/* Trending Products */}
          <Link to="/products" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 flex flex-col items-center justify-center text-center aspect-square border border-gray-100 transition-transform active:scale-[0.98]">
            <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
              <ShoppingBag size={32} color="#C9A84C" />
            </div>
            <h3 className="font-playfair font-bold text-gray-900 text-lg leading-tight">Trending<br />Products</h3>
          </Link>

        </div>
      </div>
    </div>
  );
}