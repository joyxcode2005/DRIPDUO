import { useEffect, useState } from "react";

// THE ORIGINAL REVEAL COMPONENT
export default function Reveal({
    children,
    className = "",
    threshold = 0.18,
}: {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
}) {
    const [node, setNode] = useState<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!node) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, [node, threshold]);

    return (
        <div
            ref={setNode}
            className={[
                "will-change-transform transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                inView ? "translate-y-0 opacity-100 scale-100 blur-0" : "translate-y-12 opacity-0 scale-[0.98] blur-4px",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}