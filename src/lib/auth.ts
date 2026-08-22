// ══════════════════════════════════════════════════════════════
// Client-safe Auth (localStorage-based Admin)
// This file can be imported in client components
// For NextAuth server-side auth, use auth-server.ts
// ══════════════════════════════════════════════════════════════

const ADMIN_SESSION_KEY = 'beliseken_admin_session';
const ADMIN_PASSWORDS_KEY = 'beliseken_admin_passwords';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Initialize admin password if not exists
function initAdminPassword(): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(ADMIN_PASSWORDS_KEY);
    if (!stored) {
      const passwords: Record<string, string> = {
        'admin@beliseken.com': '123456',
      };
      localStorage.setItem(ADMIN_PASSWORDS_KEY, JSON.stringify(passwords));
    }
  } catch {}
}

export function loginAdmin(
  email: string,
  password: string
): AdminUser | null {
  if (typeof window === 'undefined') return null;
  
  initAdminPassword();

  try {
    const stored = localStorage.getItem(ADMIN_PASSWORDS_KEY);
    const passwords: Record<string, string> = stored ? JSON.parse(stored) : {};
    
    if (passwords[email] !== password) {
      return null;
    }

    const adminUser: AdminUser = {
      id: 'admin-1',
      email,
      name: 'Admin BeliSeken',
      role: 'SUPER_ADMIN',
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    return adminUser;
  } catch {
    return null;
  }
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return null;
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  return getAdminUser() !== null;
}
