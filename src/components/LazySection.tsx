"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** Pixels above viewport to start loading */
  rootMargin?: string;
  className?: string;
  /** Placeholder shown before children load */
  fallback?: ReactNode;
}

export default function LazySection({
  children,
  rootMargin = "200px",
  className = "",
  fallback,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : (fallback ?? <div className="min-h-[100px]" />)}
    </div>
  );
}
