export default function FilterSidebar() {
  return (
    <aside className="hidden lg:block w-[300px]">
      <div className="bg-white border border-black/5 p-10 lg:p-12 sticky top-32 lg:top-40 h-fit max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar shadow-xl rounded-3xl">
        <h3 className="font-black text-xl mb-10 tracking-[1.5px] text-[#000814] uppercase">FILTERS</h3>
        <div className="mb-10 group">
          <span className="input-label text-primary font-black mb-4">Stops Count</span>
          <div className="flex flex-col gap-4 mt-6">
            {["Non-Stop", "1+ Stop"].map((stop) => (
              <label key={stop} className="flex items-center gap-4 text-[0.95rem] font-bold cursor-pointer text-[#1e293b] hover:text-primary transition-all">
                <input type="checkbox" className="w-[18px] h-[18px] accent-primary" /> {stop}
              </label>
            ))}
          </div>
        </div>
        <div className="group">
          <span className="input-label text-primary font-black mb-4">Airlines</span>
          <div className="flex flex-col gap-4 mt-6">
            {["IndiGo", "Air India", "Vistara", "Emirates", "Singapore Airlines", "Akasa Air"].map((airline) => (
              <label key={airline} className="flex items-center gap-4 text-[0.95rem] font-bold cursor-pointer text-[#1e293b] hover:text-primary transition-all">
                <input type="checkbox" className="w-[18px] h-[18px] accent-primary" /> {airline}
              </label>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .input-label {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </aside>
  );
}
