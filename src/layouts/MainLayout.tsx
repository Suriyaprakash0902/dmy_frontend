import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Database, Coins, Heart, User } from "lucide-react";

export default function MainLayout() {
    const location = useLocation();

    const navItems = [
        { path: "/home", icon: Home },
        { path: "/gold-bars", icon: Database },
        { path: "/scheme", icon: Coins },
        { path: "/wishlist", icon: Heart },
        { path: "/profile", icon: User },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] relative h-full">
            <div className="flex-1 overflow-y-auto pb-24">
                <div className="min-h-full">
                    <Outlet />
                </div>
            </div>

            {/* Bottom Navigation Navbar */}
            <div className="absolute bottom-0 left-0 w-full bg-black py-4 px-6 flex justify-around items-center rounded-t-[30px] z-50">
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
