import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#01040a] py-24 px-0 border-t border-white/10 mt-16">
      <div className="container grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-16 mb-16">
        <div>
          <Link href="/" className="mb-8 flex decoration-0">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-2xl shadow-glow-gold">✈️</div>
            <span className="text-3xl ml-3 font-black tracking-widest text-white uppercase">SKYVOYAGE</span>
          </Link>
          <p className="text-text-muted text-[0.95rem] leading-[1.8] mb-8">
            Redefining the art of air travel with premium comfort and global connectivity. Fly the skies with elegance.
          </p>
          <div className="flex gap-[15px]">
            {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((icon) => (
              <a 
                key={icon}
                href="#" 
                className="w-[45px] h-[45px] bg-white/5 rounded-full flex items-center justify-center text-primary transition-colors hover:bg-white/10"
              >
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black mb-8 text-[0.85rem] tracking-[2px] text-primary uppercase">FLIGHT SERVICES</h4>
          <ul className="list-none flex flex-col gap-4">
            {['International Routes', 'Domestic Hubs', 'Flight Status', 'Online Check-in', 'Cargo Services'].map((item) => (
              <li key={item}>
                <Link href="/" className="text-text-muted no-underline text-[0.9rem] transition-colors hover:text-primary">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 text-[0.85rem] tracking-[2px] text-primary uppercase">SUPPORT & HELP</h4>
          <ul className="list-none flex flex-col gap-4">
            {['Help Desk', 'Baggage Info', 'Refund Policy', 'Special Assistance', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <Link href="/" className="text-text-muted no-underline text-[0.9rem] transition-colors hover:text-primary">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-8 text-[0.85rem] tracking-[2px] text-primary uppercase">SKY NEWSLETTER</h4>
          <p className="text-text-muted text-[0.9rem] mb-6">Join our elite list for early bird offers and member-only news.</p>
          <div className="flex gap-[10px]">
            <input 
              type="email" 
              placeholder="Email" 
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl color-white outline-none focus:border-primary/50 transition-colors"
            />
            <button className="btn btn-primary px-5 py-3 rounded-xl"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
      <div className="container pt-12 border-t border-white/10 text-center">
        <p className="text-text-muted text-[0.85rem] font-bold uppercase tracking-wider">
          © 2026 SKYVOYAGE AIRLINES. ALL RIGHTS RESERVED. DESIGNED FOR EXCELLENCE.
        </p>
      </div>
    </footer>
  );
}
