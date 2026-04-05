import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import NotificationCenter from "@/components/layout/NotificationCenter";

export default function Header() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <header className="bg-dark/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-[1100] h-[var(--nav-height)]">
      <nav className="container flex justify-between items-center h-full">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-widest text-white decoration-0 hover:scale-[1.02] transition-transform">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-2xl shadow-glow-gold">✈️</div>
          <span>SKYVOYAGE</span>
        </Link>

        {/* ... existing nav ... */}
        <ul className="hidden lg:flex gap-11 h-full items-center list-none">
          <li className="h-full flex items-center group relative cursor-pointer">
            <span className="text-text-muted hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
              Explore <i className="fas fa-chevron-down text-[0.6rem] opacity-50"></i>
            </span>
          </li>
          <li className="h-full flex items-center group relative cursor-pointer">
             <Link href="/dashboard" className="text-text-muted hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors decoration-0">Travel Hub</Link>
          </li>
          <li>
            <Link href="/" className="text-text-muted hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors decoration-0">Concierge</Link>
          </li>
        </ul>

        <div className="nav-actions flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <NotificationCenter />
              <div className="h-8 w-[1px] bg-white/10" />
              <Link href="/dashboard" className="flex items-center gap-4 group">
                <div className="flex flex-col text-right">
                  <span className="text-white font-black text-xs uppercase tracking-widest group-hover:text-primary transition-colors">{user.first_name} {user.last_name}</span>
                  <span className="text-primary text-[0.6rem] font-bold uppercase tracking-widest italic">{user.loyalty?.tier || 'Silver'} Member</span>
                </div>
                <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-text-muted border border-white/5 group-hover:border-primary/30 transition-all overflow-hidden relative shadow-glow-gold">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-black text-sm text-white">{user.first_name[0]}{user.last_name[0]}</span>
                  )}
                </div>
              </Link>
              <button onClick={logout} className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-white/10 transition-all border border-white/5">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="btn btn-primary px-8 py-3 rounded-xl font-black text-xs tracking-widest shadow-glow-gold transition-all hover:scale-105"
            >
              SIGN IN
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <style jsx>{`
        .mega-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .mega-col h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #1f2937;
          margin-bottom: 1.8rem;
          font-weight: 900;
        }
        .mega-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .mega-links a {
          color: #1e293b;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 10px;
        }
        .mega-links a:hover {
          background: rgba(197, 160, 89, 0.1);
          color: var(--primary);
          transform: translateX(8px);
        }
        .mega-links i {
          font-size: 0.85rem;
          color: var(--primary);
        }
      `}</style>
    </header>
  );
}
