import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Database, Coins, ShoppingBag, User } from "lucide-react";

export default function MainLayout() {
    const location = useLocation();

    const navItems = [
        { path: "/home", icon: Home },
        { path: "/gold-bars", icon: Database },
        { path: "/scheme", icon: Coins },
        { path: "/products", icon: ShoppingBag },
        { path: "/profile", icon: User },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] relative">
            <div className="flex-1 pb-24">
                <div className="min-h-full">
                    <Outlet />
                </div>
            </div>

            {/* Bottom Navigation Navbar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black py-4 px-6 flex justify-around items-center rounded-t-[30px] z-[99] border-t border-[#D4AF37]/20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                {navItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link key={i} to={item.path} className={`flex flex-col items-center p-2 transition-transform duration-200 ${isActive ? 'text-[#D4AF37] scale-110' : 'text-white hover:text-[#D4AF37]'}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
