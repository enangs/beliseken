export interface AdminUser {
  email: string;
  name: string;
  role: "admin";
}

const ADMIN_EMAIL = "admin@beliseken.com";
const ADMIN_PASS = "123456";
const AUTH_KEY = "beliseken_admin_auth";

export function loginAdmin(email: string, password: string): AdminUser | null {
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const user: AdminUser = { email, name: "Admin BeliSeken", role: "admin" };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
    return user;
  }
  return null;
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminUser() !== null;
}
