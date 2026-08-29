// Client-side API helper for user authentication
// Supabase database is primary; localStorage only for session caching

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  addresses: UserAddress[];
  createdAt: string;
}

interface UserAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  cityId: string;
  province: string;
  provinceId: string;
  postcode: string;
  isDefault: boolean;
}

const API_BASE = '/api';
const isClient = typeof window !== 'undefined';

// ═══════════════════════════════════════════════════════════
// SESSION — localStorage only caches session, NOT user data
// ═══════════════════════════════════════════════════════════

function getLocalSession(): User | null {
  if (!isClient) return null;
  try {
    // Try localStorage first
    const stored = localStorage.getItem('beliseken_user_session');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id) return parsed;
    }
  } catch {}
  
  // Fallback: try reading from cookie (set by Google callback)
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, ...rest] = cookie.split('=');
      if (name.trim() === 'beliseken_user_session') {
        const value = rest.join('=').trim();
        if (value) {
          const parsed = JSON.parse(decodeURIComponent(value));
          if (parsed && parsed.id) {
            // Restore to localStorage for future reads
            localStorage.setItem('beliseken_user_session', JSON.stringify(parsed));
            return parsed;
          }
        }
      }
    }
  } catch {}
  
  return null;
}

function setLocalSession(user: User | null) {
  if (!isClient) return;
  if (user) {
    localStorage.setItem('beliseken_user_session', JSON.stringify(user));
    // Also save email as backup identifier
    if (user.email) {
      localStorage.setItem('beliseken_user_email', user.email);
    }
  } else {
    localStorage.removeItem('beliseken_user_session');
    localStorage.removeItem('beliseken_user_email');
  }
}

// ═══════════════════════════════════════════════════════════
// REGISTER — always saves to Supabase
// ═══════════════════════════════════════════════════════════

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      const user: User = {
        ...result.data,
        addresses: result.data.addresses || [],
        createdAt: result.data.createdAt || new Date().toISOString(),
      };
      setLocalSession(user);
      console.log('✅ Registered via API, session saved');
      return { success: true, user };
    }
    
    return { success: false, error: result.error || 'Registration failed' };
  } catch (error) {
    console.error('❌ Register API failed:', error);
    return { success: false, error: 'Koneksi gagal. Silakan coba lagi.' };
  }
}

// ═══════════════════════════════════════════════════════════
// LOGIN — always checks Supabase
// ═══════════════════════════════════════════════════════════

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User; needsVerification?: boolean }> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      const user: User = {
        ...result.data,
        addresses: result.data.addresses || [],
        createdAt: result.data.createdAt || new Date().toISOString(),
      };
      setLocalSession(user);
      console.log('✅ Logged in via API, session saved');
      return { success: true, user };
    }
    
    // Check if needs verification
    if (result.needsVerification) {
      return { success: false, error: result.error, needsVerification: true };
    }
    
    return { success: false, error: result.error || 'Login failed' };
  } catch (error) {
    console.error('❌ Login API failed:', error);
    return { success: false, error: 'Koneksi gagal. Silakan coba lagi.' };
  }
}

// ═══════════════════════════════════════════════════════════
// SESSION MANAGEMENT — from localStorage cache
// ═══════════════════════════════════════════════════════════

export function getCurrentUser(): User | null {
  return getLocalSession();
}

export function logoutUser() {
  setLocalSession(null);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function getDefaultAddress(): UserAddress | null {
  const user = getCurrentUser();
  if (!user) return null;
  return user.addresses.find(a => a.isDefault) || user.addresses[0] || null;
}

// Save address — API first, then update local session
export async function saveUserAddress(address: Omit<UserAddress, 'id'>): Promise<UserAddress | null> {
  const user = getCurrentUser();
  if (!user) return null;
  
  const newAddress: UserAddress = {
    ...address,
    id: String(Date.now()),
  };
  
  // If set as default, unset others
  if (newAddress.isDefault) {
    user.addresses = user.addresses.map(a => ({ ...a, isDefault: false }));
  }
  
  user.addresses.push(newAddress);
  setLocalSession(user);
  
  // Try API
  try {
    await fetch(`${API_BASE}/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, ...address }),
    });
  } catch {}
  
  return newAddress;
}

// Get all customers (admin) — always from Supabase API
export async function getAllCustomers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE}/admin/customers`, {
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log('✅ Customers loaded from Supabase:', result.data.length);
      return result.data;
    }
  } catch (error) {
    console.warn('❌ Failed to fetch customers from API:', error);
  }
  
  return [];
}
