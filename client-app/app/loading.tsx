export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle Background Branding */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[15vw] font-black uppercase tracking-tighter text-[#C5A059]">DRIPDUO</span>
      </div>
      
      {/* Elegant Spinner & Text */}
      <div className="z-10 flex flex-col items-center gap-8">
        <div className="w-12 h-12 border-t border-r border-[#C5A059] rounded-full animate-spin"></div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
          Loading Archive...
        </span>
      </div>
    </div>
  );
}