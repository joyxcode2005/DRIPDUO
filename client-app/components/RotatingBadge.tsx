export default function RotatingBadge() {
    return (
        <>
            {/* --- MOBILE VIEW (A little bigger: 80px) --- */}
            <div className="md:hidden relative shrink-0 pointer-events-none animate-[spin_15s_linear_infinite] h-20 w-20">
                <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                    <defs>
                        <filter id="textShadowMobile" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
                        </filter>
                    </defs>
                    <path id="badgePathMobile" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                    <text filter="url(#textShadowMobile)" fontSize="9" fill="var(--orange)" fontWeight="700" letterSpacing="0.05em" className="font-sans uppercase">
                        <textPath href="#badgePathMobile" startOffset="0%" textLength="204">
                            ESTIMATED 2026 • DRIPDUO •
                        </textPath>
                    </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-(--orange) h-2 w-2" />
                </div>
            </div>

            {/* --- DESKTOP VIEW (Stays at 140px) --- */}
            <div className="hidden md:block relative shrink-0 pointer-events-none animate-[spin_15s_linear_infinite] h-35 w-35">
                <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                    <defs>
                        <filter id="textShadowDesktop" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
                        </filter>
                    </defs>
                    <path id="badgePathDesktop" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                    <text filter="url(#textShadowDesktop)" fontSize="10.5" fill="var(--orange)" fontWeight="700" letterSpacing="0.05em" className="font-sans uppercase">
                        <textPath href="#badgePathDesktop" startOffset="0%" textLength="219">
                            ESTIMATED 2026 • DRIPDUO •
                        </textPath>
                    </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-(--orange) h-2 w-2" />
                </div>
            </div>
        </>
    );
}