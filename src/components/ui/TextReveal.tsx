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
        scale: 1,
        color: baseColor || "rgba(255, 255, 255, 0.5)", 
        fontWeight: 700
      });

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        
        tl.to(chars, {
          color: activeColor || "#ffffff",
          scale: 1.05,
          fontWeight: 900,
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

    // Cache exact absolute coordinates so we don't recalculate layout 60x a second
    let cachedRects: { x: number, y: number, w: number, h: number }[] = [];
    const updateCache = () => {
       cachedRects = charsRef.current.map((char) => {
           if (!char) return { x: 0, y: 0, w: 0, h: 0 };
           const rect = char.getBoundingClientRect();
           return {
               // Store absolute document coordinates
               x: rect.left + window.scrollX,
               y: rect.top + window.scrollY,
               w: rect.width,
               h: rect.height
           };
       });
    };
    
    // Initial cache and resize listener
    updateCache();
    window.addEventListener("resize", updateCache);

    // Remove GSAP requestAnimationFrame entirely for massive CPU boost
    const maxDistance = 120;
    const maxScale = 1.35;
    const minScale = 1;

    const resetStyles = () => {
      charsRef.current.forEach((char, i) => {
        if (!char) return;
        
        // When not hovered, base blurry state for inner spans
        gsap.to(char, {
          scale: 1,
          filter: "blur(2.5px)",
          opacity: 0.8,
          color: originalColorsRef.current[i] || "inherit",
          fontWeight: originalFontWeightsRef.current[i] || 400,
          duration: 0.3,
          overwrite: "auto",
          ease: "power2.out"
        });
        
        if (char.parentElement) {
          gsap.to(char.parentElement, {
            width: originalWidthsRef.current[i] || 0,
            duration: 0.3,
            overwrite: "auto",
            ease: "power2.out"
          });
        }
      });
    };

    // Apply default blur initially
    resetStyles();

    const handleMouseEnter = () => {
      updateCache();
      
      // When entering, everything immediately becomes clear
      charsRef.current.forEach((char) => {
        if (!char) return;
        gsap.to(char, {
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.3,
          overwrite: true, // Force overwrite any previous blurry tweens
          ease: "power2.out"
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const focusX = e.clientX;
      const focusY = e.clientY;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      charsRef.current.forEach((char, i) => {
        if (!char) return;
        
        const cached = cachedRects[i];
        if (!cached) return;

        const charCenterX = (cached.x - scrollX) + cached.w / 2;
        const charCenterY = (cached.y - scrollY) + cached.h / 2;
        
        const distance = Math.sqrt(Math.pow(focusX - charCenterX, 2) + Math.pow(focusY - charCenterY, 2));

        let scale = minScale;
        let color = originalColorsRef.current[i] || "inherit";
        
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
          
          if (activeColor && effectStrength > 0.5) {
             color = activeColor;
          }
        }

        // We only use GSAP here to smoothly tween properties 
        // that change based on exact cursor distance.
        // Ensure filter and opacity are explicitly forced to clear state
        gsap.to(char, {
          scale: scale,
          color: color,
          fontWeight: fontWeight,
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.15, // Faster response time for movement
          overwrite: "auto",
          ease: "power2.out",
          zIndex: distance < maxDistance ? 10 : 1
        });

        if (char.parentElement) {
          const originalWidth = originalWidthsRef.current[i] || 0;
          gsap.to(char.parentElement, {
            width: originalWidth * scale,
            duration: 0.15,
            overwrite: "auto",
            ease: "power2.out"
          });
        }
      });
    };

    const handleMouseLeave = () => {
      resetStyles();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mousemove", handleMouseMove as any);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    
    window.addEventListener("resize", updateCache);

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mousemove", handleMouseMove as any);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", updateCache);
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
