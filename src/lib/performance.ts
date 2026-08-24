// Performance utilities for BeliSeken.com

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastTime: number;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastTime >= limit) {
          func.apply(this, args);
          lastTime = Date.now();
        }
      }, limit - (Date.now() - lastTime));
    }
  };
}

// Memoize utility
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const memoize = new Map<string, ReturnType<T>>();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (memoize.has(key)) {
      return memoize.get(key)!;
    }
    
    const result = func.apply(this, args);
    memoize.set(key, result);
    
    return result;
  } as T;
}

// Image preloader
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Intersection Observer hook for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Performance measurement
export function measurePerformance(name: string, fn: () => void): void {
  if (typeof performance !== 'undefined') {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
    
    // Clean up
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  } else {
    fn();
  }
}

// Request idle callback polyfill
export const requestIdleCallback = 
  typeof window !== 'undefined' && (window as any).requestIdleCallback
    ? (window as any).requestIdleCallback
    : (callback: (deadline: IdleDeadline) => void) => {
        const start = Date.now();
        return setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, 1);
      };

// Cancel idle callback polyfill
export const cancelIdleCallback = 
  typeof window !== 'undefined' && (window as any).cancelIdleCallback
    ? (window as any).cancelIdleCallback
    : (id: number) => clearTimeout(id);

// Type for IdleDeadline
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

// Virtual scrolling helper
export function calculateVirtualScroll(
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  scrollTop: number,
  overscan: number = 5
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  return {
    startIndex,
    endIndex,
    totalHeight: totalItems * itemHeight,
    offsetY: startIndex * itemHeight,
  };
}
