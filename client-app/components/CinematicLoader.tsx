"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- CONFIGURATION ---
const GRID_SIZE = 5; // 5x5 Grid = 25 paper slices

// Premium broadcast-quality easing curves
const paperTumbleEase = [0.22, 1, 0.36, 1];
const textRevealEase = [0.65, 0, 0.35, 1];

// A deterministic pseudo-random number generator to prevent Next.js hydration crashes
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export default function CinematicLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);

  // Responsive Configuration State
  const [screenConfig, setScreenConfig] = useState({
    logoSize: 250,   
    scatter: 600,    
    depth: 800,      
    radius: 28,      
  });

  useEffect(() => {
    // Dynamically adjust sizes based on device screen width
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // MOBILE CONFIGURATION 
        setScreenConfig({
          logoSize: 125,  
          scatter: 200,   
          depth: 400,     
          radius: 14,     
        });
      } else {
        // DESKTOP CONFIGURATION
        setScreenConfig({
          logoSize: 250,  
          scatter: 600,   
          depth: 800,     
          radius: 28,     
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Timing Sequence
    const exitTimer = setTimeout(() => setIsVisible(false), 5500);
    const doneTimer = setTimeout(() => setIsDone(true), 7000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const CELL_SIZE = screenConfig.logoSize / GRID_SIZE;

  // Generate the 25 grid slices
  const cells = [];
  let index = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cells.push({ r, c, index: index++ });
    }
  }

  if (isDone) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
          transition={{ duration: 1.2, ease: textRevealEase }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          // Perspective gives the flying papers true 3D depth
          style={{ perspective: 1500 }} 
        >
          
          {/* --- 3D TUMBLING PAPER PUZZLE --- */}
          <div
            className="relative grid"
            style={{
              width: screenConfig.logoSize,
              height: screenConfig.logoSize,
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              // This double drop-shadow gives the assembled logo massive, solid 3D elevation
              filter: "drop-shadow(0px 30px 40px rgba(0, 0, 0, 0.9)) drop-shadow(0px 10px 20px rgba(238, 60, 36, 0.25))",
              transformStyle: "preserve-3d"
            }}
          >
            {cells.map(({ r, c, index }) => {
              const rand1 = pseudoRandom(index * 10);
              const rand2 = pseudoRandom(index * 20);
              const rand3 = pseudoRandom(index * 30);

              // 3D Scatter Physics 
              const xOffset = Number(((rand1 - 0.5) * screenConfig.scatter).toFixed(2)); 
              const yOffset = Number(((rand2 - 0.5) * screenConfig.scatter).toFixed(2));
              const zOffset = Number((-screenConfig.depth - (rand3 * screenConfig.depth)).toFixed(2)); 

              // Extreme tumbling rotations
              const rotX = Number(((rand1 - 0.5) * 720).toFixed(2)); 
              const rotY = Number(((rand2 - 0.5) * 720).toFixed(2));
              const rotZ = Number(((rand3 - 0.5) * 360).toFixed(2));

              const delay = Number((0.1 + (rand1 * 0.4)).toFixed(2));

              // Determine exact border radius for the 4 outermost corners
              let borderRadius = "0px";
              if (r === 0 && c === 0) borderRadius = `${screenConfig.radius}px 0 0 0`; 
              if (r === 0 && c === GRID_SIZE - 1) borderRadius = `0 ${screenConfig.radius}px 0 0`; 
              if (r === GRID_SIZE - 1 && c === 0) borderRadius = `0 0 0 ${screenConfig.radius}px`; 
              if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) borderRadius = `0 0 ${screenConfig.radius}px 0`; 

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: xOffset,
                    y: yOffset,
                    z: zOffset,
                    rotateX: rotX,
                    rotateY: rotY,
                    rotateZ: rotZ,
                    scale: 0.8,
                    // Strong 3D shadows and rim light while flying in space
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.9), inset 0 0 2px rgba(255,255,255,0.3)"
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    z: 0,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    // scale 1.015 forces the pieces to overlap by a fraction of a pixel, destroying all visible gaps
                    scale: 1.015,
                    // Shadow dissolves to 0 as it locks into the grid, fusing it into one solid block
                    boxShadow: "0px 0px 0px rgba(0,0,0,0), inset 0 0 0px rgba(255,255,255,0)"
                  }}
                  transition={{
                    duration: 3.2, 
                    delay: delay,
                    ease: paperTumbleEase,
                  }}
                  className="relative overflow-hidden"
                  style={{ 
                    width: CELL_SIZE, 
                    height: CELL_SIZE,
                    borderRadius: borderRadius, 
                    transformStyle: "preserve-3d",
                    backgroundColor: "#1a1a1a", 
                  }}
                >
                  {/* The actual sliced image */}
                  <Image
                    src="/images/loader.png"
                    alt="Logo paper slice"
                    width={screenConfig.logoSize}
                    height={screenConfig.logoSize}
                    priority
                    className="absolute max-w-none"
                    style={{
                      top: -(r * CELL_SIZE),
                      left: -(c * CELL_SIZE),
                      width: screenConfig.logoSize,
                      height: screenConfig.logoSize,
                      objectFit: "cover",
                      WebkitBackfaceVisibility: "hidden", 
                      // Adding a tiny scale here ensures the image texture bleeds past the slice edges
                      transform: "scale(1.02)",
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* --- BRAND TYPOGRAPHY --- */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ delay: 2.8, duration: 1.8, ease: paperTumbleEase }}
            className="absolute bottom-16 md:bottom-24 flex flex-col items-center gap-2 md:gap-3"
          >
            <span
              style={{
                fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize: "clamp(14px, 3.5vw, 19px)", 
                fontWeight: 900,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#ECE7D1",
              }}
            >
              DRIPDUO
            </span>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "clamp(80px, 20vw, 120px)" }} 
              transition={{ delay: 3.3, duration: 1.4, ease: textRevealEase }}
              style={{ height: 1, background: "#EE3C24" }}
            />
            
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8, duration: 1.2 }}
              style={{
                fontFamily: "'EB Garamond',Georgia,serif",
                fontSize: "clamp(10px, 2.5vw, 13px)", 
                fontStyle: "italic",
                letterSpacing: "0.22em",
                color: "#EE3C24",
              }}
            >
              Curating Collection
            </motion.span>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}