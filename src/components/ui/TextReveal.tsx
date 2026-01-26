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

  useGSAP(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll(".char-outer");
    
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      gsap.fromTo(
        chars,
        { y: 100, opacity: 0, rotateX: -80, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          stagger: 0.01,
          duration: 0.5,
          ease: "power4.out",
          delay: 0
        }
      );
      if (containerRef.current) {
        containerRef.current.style.overflow = "visible";
      }
      return;
    }

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

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const chars = charsRef.current.filter(Boolean);
      
      gsap.set(chars, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        color: baseColor || "rgba(255, 255, 255, 0.5)", 
        fontWeight: 400
      });

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        
        tl.to(chars, {
          color: activeColor || "#ffffff",
          textShadow: "0 0 10px rgba(255,255,255,0.5)",
          scale: 1.1,
          fontWeight: 600,
          stagger: {
            each: 0.1, 
            yoyo: true,
            repeat: 1, 
          },
          duration: 0.5, 
          ease: "sine.inOut",
        });
      });

      return () => ctx.revert(); 
    }

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
    let autoScanFrameId: number | null = null;

    const updateEffects = () => {
      // If mouse is NOT active, everything should be clear (default state)
      if (!isMouseActive) {
        charsRef.current.forEach((char, i) => {
            if (!char) return;
            // Reset to clean state
            gsap.to(char, {
                scale: 1,
                filter: "blur(0px)",
                opacity: 1,
                color: originalColorsRef.current[i] || "inherit",
                fontWeight: originalFontWeightsRef.current[i] || 400,
                duration: 0.5,
                ease: "power2.out"
            });
            // Reset width wrapper if it exists
            if (char.parentElement) {
                const originalWidth = originalWidthsRef.current[i] || 0;
                gsap.to(char.parentElement, {
                    width: originalWidth,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
        
        // Reset focus points so they don't linger
        focusX = -1000;
        focusY = -1000;
        
        autoScanFrameId = requestAnimationFrame(updateEffects);
        return; 
      }

      // Mouse IS active: Apply Spotlight Focus logic
      const focusRadius = 80; 
      const blurRange = 250;  
      const maxBlur = 4; // Subtle blur for non-focused items     
      const maxDistance = 120;
      const maxScale = 1.35;
      const minScale = 1;

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

        const originalWeightStr = originalFontWeightsRef.current[i] || "400";
        let startWeight = 400;
        if (originalWeightStr === "bold") startWeight = 700;
        else if (originalWeightStr === "normal") startWeight = 400;
        else startWeight = parseInt(originalWeightStr, 10) || 400;
        
        let fontWeight = startWeight;

        // Interaction Zone (scaling + bolding)
        if (distance < maxDistance) {
          const effectStrength = Math.cos((distance / maxDistance) * (Math.PI / 2));
          scale = minScale + (maxScale - minScale) * effectStrength;
          
          const targetWeight = Math.max(startWeight, 700);
          fontWeight = startWeight + (targetWeight - startWeight) * effectStrength;
          
          // Switch to active color when very close
          if (activeColor) {
             color = activeColor;
          }
        }

        // Blur Zone (Outside Focus)
        // If we are interacting, blur everything OUTSIDE the focus radius
        if (distance > focusRadius) {
          const blurStrength = Math.min((distance - focusRadius) / blurRange, 1);
          blur = blurStrength * maxBlur; 
          opacity = 1 - (blurStrength * 0.3); // Dim slightly
        } else {
           // Inside focus radius: Sharp
           blur = 0;
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

        if (char.parentElement) {
            const originalWidth = originalWidthsRef.current[i] || 0;
            const targetWidth = originalWidth * scale; 
            
            gsap.to(char.parentElement, {
                width: targetWidth,
                duration: 0.2,
                overwrite: "auto",
                ease: "power2.out"
            });
        }
      });

      autoScanFrameId = requestAnimationFrame(updateEffects);
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      focusX = e.clientX;
      focusY = e.clientY;
    };

    const handleMouseLeave = () => {
        isMouseActive = false;
    };

    const handleScroll = () => {
    };

    autoScanFrameId = requestAnimationFrame(updateEffects);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave); 
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      if (autoScanFrameId) cancelAnimationFrame(autoScanFrameId);
    };
  }, [activeColor, baseColor]);

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
