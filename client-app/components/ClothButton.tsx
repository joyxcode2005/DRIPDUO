"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useTexture } from "@react-three/drei";

interface ClothButtonProps {
  size?: number;
  logoSrc?: string;
  className?: string;
  onClick?: () => void;
}

function DraggableCoinLogo({ logoSrc, isMobile }: { logoSrc: string; isMobile: boolean }) {
  // Use cloned texture to avoid ESLint immutability errors
  const baseTexture = useTexture(logoSrc);
  
  const texture = useMemo(() => {
    const tex = baseTexture.clone();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.needsUpdate = true;
    return tex;
  }, [baseTexture]);

  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
      
      if (Math.abs(groupRef.current.rotation.y) < 0.001) groupRef.current.rotation.y = 0;
      if (Math.abs(groupRef.current.rotation.x) < 0.001) groupRef.current.rotation.x = 0;
    }
  });

  const coinRadius = isMobile ? 2.2 : 3.1; 
  const coinThickness = isMobile ? 0.25 : 0.4; 
  const rimThickness = isMobile ? 0.1 : 0.16; 
  const faceOffset = coinThickness / 2 + 0.005;

  return (
    <group 
      ref={groupRef} 
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture(e.pointerId);
        isDragging.current = true;
      }}
      onPointerUp={(e) => {
        (e.target as Element).releasePointerCapture(e.pointerId);
        isDragging.current = false;
      }}
      onPointerMove={(e) => {
        if (isDragging.current && groupRef.current) {
          groupRef.current.rotation.y += e.movementX * 0.012;
          groupRef.current.rotation.x += e.movementY * 0.012;
        }
      }}
      onPointerOver={() => (document.body.style.cursor = "grab")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[coinRadius, coinRadius, coinThickness, 64]} />
        <meshPhysicalMaterial color="#050505" metalness={0.9} roughness={0.2} envMapIntensity={2.0} />
      </mesh>

      <mesh position={[0, 0, coinThickness / 2]}>
        <torusGeometry args={[coinRadius, rimThickness, 32, 64]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} clearcoat={1.0} clearcoatRoughness={0.1} envMapIntensity={2.5} />
      </mesh>

      <mesh position={[0, 0, -coinThickness / 2]}>
        <torusGeometry args={[coinRadius, rimThickness, 32, 64]} />
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} clearcoat={1.0} clearcoatRoughness={0.1} envMapIntensity={2.5} />
      </mesh>

      <mesh position={[0, 0, faceOffset]}>
        <circleGeometry args={[coinRadius - 0.02, 64]} />
        <meshPhysicalMaterial 
          map={texture} 
          transparent={true} 
          alphaTest={0.5} 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.2} 
          clearcoat={1.0} 
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
          side={THREE.FrontSide}
        />
      </mesh>

      <mesh position={[0, 0, -faceOffset]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[coinRadius - 0.02, 64]} />
        <meshPhysicalMaterial 
          map={texture} 
          transparent={true} 
          alphaTest={0.5} 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.2} 
          clearcoat={1.0} 
          clearcoatRoughness={0.1}
          envMapIntensity={1.2}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

export default function ClothButton({
  size = 220, 
  logoSrc = "/images/transLoader.png",
  className = "",
  onClick,
}: ClothButtonProps) {
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeSize = isMobile ? size * 0.55 : size;
  const containerWidth = activeSize * 1.5;   
  const containerHeight = activeSize;
  const cameraZ = isMobile ? 7.5 : 9.0;
  const shadowY = isMobile ? -2.6 : -3.8;

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`} 
      style={{ width: containerWidth, height: containerHeight, touchAction: "none" }}
      onClick={onClick}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, cameraZ], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ overflow: "visible" }} 
        // ⚡ OPTIMIZATION: Limits pixel rendering on mobile to prevent crashes
        dpr={isMobile ? [1, 1.5] : [1, 2]}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 6, 4]} intensity={3.5} castShadow />
        <spotLight position={[-4, 4, 6]} intensity={2.0} angle={0.4} penumbra={1} />
        <pointLight position={[0, -2, 4]} intensity={1.5} color="#ece7d1" />
        
        <Environment preset="studio" />

        <React.Suspense fallback={null}>
          <DraggableCoinLogo logoSrc={logoSrc} isMobile={isMobile} />
        </React.Suspense>

        {/* ⚡ OPTIMIZATION: Baked shadow calculates once instead of 60 times a second */}
        <ContactShadows
          position={[0, shadowY, 0]}
          opacity={0.8}
          scale={30}
          blur={2.0}
          far={6}
          color="#000000"
          frames={1} 
          resolution={isMobile ? 256 : 512}
        />
      </Canvas>
    </div>
  );
}