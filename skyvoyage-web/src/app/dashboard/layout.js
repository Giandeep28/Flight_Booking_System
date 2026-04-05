"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const menuItems = [
    { name: "My Trips", icon: "fa-plane-departure", path: "/dashboard" },
    { name: "SkyMiles Loyalty", icon: "fa-crown", path: "/dashboard/loyalty" },
    { name: "Payment Methods", icon: "fa-credit-card", path: "/dashboard/payments" },
    { name: "Profile Settings", icon: "fa-user-cog", path: "/dashboard/profile" },
  ];

  if (loading) return <div className="container py-40 text-center font-black text-primary uppercase tracking-[4px]">LOADING YOUR VOYAGES...</div>;
  if (!user) return <div className="container py-40 text-center text-white">Please sign in to access your dashboard.</div>;

  return (
    <div className="container py-20 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-8">
          <div className="glass-card bg-dark/80 border border-white/10 p-10 rounded-[32px] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-white/10 shadow-glow-gold">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">{user.first_name} {user.last_name}</h2>
            <div className="mt-3 inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[0.65rem] font-black text-primary uppercase tracking-[1.5px]">
              {user.loyalty?.tier || "SILVER"} MEMBER
            </div>
          </div>

          <nav className="glass-card bg-dark/80 border border-white/10 p-4 rounded-[32px] overflow-hidden">
            <ul className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center gap-5 p-5 rounded-2xl font-bold text-sm tracking-widest transition-all ${
                      pathname === item.path 
                        ? "bg-primary text-dark shadow-glow-gold" 
                        : "text-text-muted hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <i className={`fas ${item.icon} w-5 text-center`}></i>
                    <span className="uppercase">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
