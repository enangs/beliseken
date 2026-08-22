// Prisma client singleton
// Handles graceful fallback during static export builds

let _prisma: any = null;

export function getPrisma() {
  if (_prisma) return _prisma;
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const globalForPrisma = globalThis as any;
    _prisma = globalForPrisma.__prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.__prisma = _prisma;
    }
    return _prisma;
  } catch {
    return null;
  }
}

// Lazy proxy - only initializes on first property access at runtime
export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    if (prop === '__isProxy') return true;
    const client = getPrisma();
    if (!client) {
      // Return no-op for build-time access
      if (typeof prop === 'string' && (prop.startsWith('$') || prop === 'then')) {
        return prop === 'then' ? undefined : () => Promise.resolve();
      }
      return new Proxy(() => {}, {
        get: () => new Proxy(() => {}, { get: () => () => {} }),
      });
    }
    return client[prop];
  },
});
