"use client";

import { useEffect, useState } from "react";

export default function PaperLoading() {
  const [stage, setStage] = useState<"crumpled" | "unfolding" | "flat">("crumpled");

  useEffect(() => {
    // Sequence: Crumpled ball -> Unfolding -> Flat Logo
    const timer1 = setTimeout(() => setStage("unfolding"), 1200);
    const timer2 = setTimeout(() => setStage("flat"), 1800);
    
    // Loop the animation for the loading screen effect
    const loop = setTimeout(() => {
        setStage("crumpled");
    }, 4500);

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(loop);
    };
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ background: "#050505" }}>
      
      {/* SVG Filters for Paper Wrinkles */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paper-wrinkles">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="5" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale={stage === "flat" ? "0" : "2"}>
            <feDistantLight azimuth="45" elevation="45" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" operator="in" />
        </filter>
      </svg>

      <div className="relative flex items-center justify-center" style={{ width: 400, height: 400 }}>
        
        {/* The Paper Sheet */}
        <div
          style={{
            width: stage === "crumpled" ? "60px" : "300px",
            height: stage === "crumpled" ? "60px" : "300px",
            background: "#ECE7D1", // Paper color from image
            transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            filter: "url(#paper-wrinkles) drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // This creates the "torn/crumpled" edges that straighten out
            clipPath: stage === "crumpled" 
                ? "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" 
                : "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%, 0% 100%, 0% 100%, 0% 0%)",
            animation: stage === "crumpled" ? "shaking 0.2s infinite" : "none",
            transform: stage === "crumpled" ? "rotate(15deg)" : "rotate(0deg)",
          }}
        >
          {/* The Logo (Revealed when paper opens) */}
          <img
            src="image_fa4393.png" // Your uploaded logo
            alt="Logo"
            style={{
              width: "80%",
              height: "auto",
              opacity: stage === "flat" ? 1 : 0,
              transform: stage === "flat" ? "scale(1)" : "scale(0.8)",
              transition: "all 0.5s ease-out 0.2s",
            }}
          />
        </div>
      </div>

      {/* Brand Text Branding */}
      <div style={{ marginTop: 20, textAlign: "center", opacity: stage === "flat" ? 1 : 0.3, transition: "opacity 1s" }}>
        <span style={{
          fontFamily: "Helvetica, sans-serif",
          fontSize: 20, fontWeight: 900,
          letterSpacing: "0.3em", color: "#ECE7D1", display: "block"
        }}>
          DRIPDUO
        </span>
        <span style={{
          fontFamily: "serif", fontStyle: "italic",
          fontSize: 14, color: "#EE3C24", marginTop: 5, display: "block"
        }}>
          Curating Collection
        </span>
      </div>

      <style>{`
        @keyframes shaking {
          0% { transform: translate(1px, 1px) rotate(15deg); }
          25% { transform: translate(-1px, -2px) rotate(14deg); }
          50% { transform: translate(-3px, 0px) rotate(16deg); }
          75% { transform: translate(3px, 2px) rotate(15deg); }
          100% { transform: translate(1px, -1px) rotate(15deg); }
        }
      `}</style>
    </div>
  );
}