export default function RotatingBadge({ mobile = false }: { mobile?: boolean }) {
    const sizeClass = mobile ? "h-[55px] w-[55px]" : "h-[140px] w-[140px]";
    const textLength = mobile ? "204" : "219";
    const textSize = mobile ? 9 : 10.5;
    const pathId = mobile ? "badgePathMobile" : "badgePathDesktop";

    return (
        <div className={`relative shrink-0 pointer-events-none animate-[spin_15s_linear_infinite] ${sizeClass}`}>
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                <defs>
                    <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
                    </filter>
                </defs>
                <path id={pathId} d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                <text filter="url(#textShadow)" fontSize={textSize} fill="var(--orange)" fontWeight="700" letterSpacing="0.05em" className="font-sans uppercase">
                    <textPath href={`#${pathId}`} startOffset="0%" textLength={textLength}>
                        ESTIMATED 2026 • DRIPDUO •
                    </textPath>
                </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`rounded-full bg-(--orange) ${mobile ? "h-1.5 w-1.5" : "h-2 w-2"}`} />
            </div>
        </div>
    );
}