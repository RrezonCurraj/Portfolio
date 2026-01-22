"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  activeColor?: string;
  baseColor?: string;
}

export function TextReveal({ children, className, delay = 0, activeColor, baseColor }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const originalColorsRef = useRef<string[]>([]);
  const originalFontWeightsRef = useRef<string[]>([]);
  const originalWidthsRef = useRef<number[]>([]);

  // Entrance Animation
  useGSAP(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".char-outer");
    
    gsap.fromTo(
      chars,
      { y: 100, opacity: 0, rotateX: -80, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        filter: "blur(0px)",
        stagger: 0.02,
        duration: 1,
        ease: "power4.out",
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.overflow = "visible";
          }
        }
      }
    );
  }, { scope: containerRef });

  // Unified Interaction Effect
  useEffect(() => {
    charsRef.current.forEach((char, i) => {
      if (char) {
        const style = window.getComputedStyle(char);
        originalColorsRef.current[i] = baseColor || style.color;
        originalFontWeightsRef.current[i] = style.fontWeight;
        originalWidthsRef.current[i] = char.offsetWidth;
      }
    });

    let focusX = -1000;
    let focusY = -1000;
    let isMouseActive = false;

    const updateEffects = () => {
      const focusRadius = 50; // Increased radius to prevent edge jitter
      const blurRange = 250;  
      const maxBlur = 8;      
      const maxDistance = 120;
      const maxScale = 1.35;
      const minScale = 1;
      const activationRange = 300; 

      // If mouse hasn't moved yet (Mobile), use center screen focus
      if (!isMouseActive) {
        focusX = window.innerWidth / 2;
        focusY = window.innerHeight / 2;
      }

      let minDistanceToGroup = Infinity;
      charsRef.current.forEach((char) => {
        if (!char) return;
        const rect = char.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(focusX - charCenterX, 2) + Math.pow(focusY - charCenterY, 2));
        if (dist < minDistanceToGroup) minDistanceToGroup = dist;
      });

      const isEngaged = minDistanceToGroup < activationRange;
      const globalIntensity = isEngaged 
        ? Math.pow(1 - (minDistanceToGroup / activationRange), 1.5) 
        : 0;

      charsRef.current.forEach((char, i) => {
        if (!char) return;
        const rect = char.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(Math.pow(focusX - charCenterX, 2) + Math.pow(focusY - charCenterY, 2));

        let scale = minScale;
        let blur = 0;
        let opacity = 1;
        let color = originalColorsRef.current[i] || "inherit";

        // Font Weight Logic
        const originalWeightStr = originalFontWeightsRef.current[i] || "400";
        let startWeight = 400;
        if (originalWeightStr === "bold") startWeight = 700;
        else if (originalWeightStr === "normal") startWeight = 400;
        else startWeight = parseInt(originalWeightStr, 10) || 400;
        
        let fontWeight = startWeight;

        if (distance < maxDistance) {
          const effectStrength = Math.cos((distance / maxDistance) * (Math.PI / 2));
          scale = minScale + (maxScale - minScale) * effectStrength;
          
          const targetWeight = Math.max(startWeight, 700);
          fontWeight = startWeight + (targetWeight - startWeight) * effectStrength;
        }

        if (distance > focusRadius) {
          const blurStrength = Math.min((distance - focusRadius) / blurRange, 1);
          blur = blurStrength * maxBlur * globalIntensity;
          opacity = 1 - (blurStrength * 0.5 * globalIntensity);
        } else {
           color = activeColor || "white";
           opacity = 1;
        }

        gsap.to(char, {
          scale: scale,
          filter: `blur(${blur}px)`,
          opacity: opacity,
          color: color,
          fontWeight: fontWeight,
          duration: 0.2,
          overwrite: "auto",
          ease: "power2.out",
          zIndex: distance < focusRadius ? 10 : 1
        });

        // Animate width of the wrapper to prevent overlap (only on desktop)
        if (char.parentElement && window.innerWidth >= 768) {
            const originalWidth = originalWidthsRef.current[i] || 0;
            // Add a small buffer to scale to give a bit more breathing room/spacing
            const targetWidth = originalWidth * scale; // Standard expansion
            
            gsap.to(char.parentElement, {
                width: targetWidth,
                duration: 0.2,
                overwrite: "auto",
                ease: "power2.out"
            });
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      focusX = e.clientX;
      focusY = e.clientY;
      requestAnimationFrame(updateEffects);
    };

    const handleScroll = () => {
      // Keep isMouseActive state as is! Do not reset it.
      // Just update positions relative to scroll.
      requestAnimationFrame(updateEffects);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeColor]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden leading-tight p-4 -m-4 relative", className)}>
      <span className="sr-only">{children}</span>
      {children.split("").map((char, i) => (
        <span 
          key={i} 
          className="char-outer inline-block"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <span
            ref={(el) => { charsRef.current[i] = el; }}
            className="inline-block cursor-default select-none relative"
            style={{ transformOrigin: "bottom center" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </div>
  );
}
