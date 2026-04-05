import Link from "next/link";

export default function FlightCard({ flight }) {
  const { airline, departure_time, arrival_time, duration, price, from, to, stops } = flight;
  
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch (e) {
      return isoString.includes("T") ? isoString.split("T")[1].substring(0, 5) : isoString;
    }
  };

  return (
    <div className="glass-card bg-dark/80 border border-white/10 p-8 md:p-10 flex flex-col md:grid md:grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_2fr] items-center gap-8 mb-6 hover:bg-primary/[0.02] transition-all">
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="w-12 h-12 relative flex items-center justify-center bg-white/5 rounded-lg p-2">
          <img 
            src={`https://www.gstatic.com/flights/airline_logos/70px/${airline.code}.png`} 
            alt={airline.name || airline.code}
            className="h-full w-full object-contain filter brightness-125 saturate-150"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[1rem] text-white uppercase tracking-wider">{airline.name || airline.code}</span>
          <span className="text-[0.65rem] font-black text-text-muted tracking-widest">{airline.code}-732</span>
        </div>
      </div>

      <div className="text-center md:text-left w-full md:w-auto">
        <div className="font-black text-2xl mb-1 text-white">{formatTime(departure_time)}</div>
        <div className="text-[0.85rem] font-bold text-text-muted tracking-widest uppercase italic">{from}</div>
      </div>

      <div className="text-center w-full md:w-auto">
        <div className="text-[0.85rem] text-text-muted mb-3 font-semibold uppercase tracking-tighter">{duration}</div>
        <div className="h-[2px] w-20 bg-white/10 mx-auto relative">
          <div className="w-2 h-2 bg-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-glow-gold" />
        </div>
        <div className="text-[0.7rem] text-primary font-black mt-3 uppercase tracking-[2px] italic">
          {stops === 0 ? "NON-STOP" : `${stops} STOP${stops > 1 ? 'S' : ''}`}
        </div>
      </div>

      <div className="text-center md:text-right w-full md:w-auto">
        <div className="font-black text-2xl mb-1 text-white">{formatTime(arrival_time)}</div>
        <div className="text-[0.85rem] font-bold text-text-muted tracking-widest uppercase italic">{to}</div>
      </div>

      <div className="text-center md:text-right w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
        <div className="text-[2.2rem] font-black text-primary mb-4 leading-none">₹{price.toLocaleString()}</div>
        <Link 
          href={`/booking?flightId=${flight.id}&class=economy`}
          className="btn btn-primary w-full rounded-xl py-4 text-[0.85rem] font-black tracking-widest shadow-glow-gold hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          SECURE SEAT <i className="fas fa-chevron-right text-[0.6rem]"></i>
        </Link>
      </div>
    </div>
  );
}
