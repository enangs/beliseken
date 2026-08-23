// Client-side API helper for user authentication
// Uses Supabase database with localStorage fallback

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

// localStorage helpers
function getLocalUsers(): User[] {
  if (!isClient) return [];
  try {
    const stored = localStorage.getItem('beliseken_users');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveLocalUsers(users: User[]) {
  if (!isClient) return;
  localStorage.setItem('beliseken_users', JSON.stringify(users));
}

function getLocalSession(): User | null {
  if (!isClient) return null;
  try {
    const stored = localStorage.getItem('beliseken_user_session');
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function setLocalSession(user: User | null) {
  if (!isClient) return;
  if (user) {
    localStorage.setItem('beliseken_user_session', JSON.stringify(user));
  } else {
    localStorage.removeItem('beliseken_user_session');
  }
}

function getLocalPasswords(): Record<string, string> {
  if (!isClient) return {};
  try {
    const stored = localStorage.getItem('beliseken_passwords');
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function saveLocalPassword(email: string, password: string) {
  if (!isClient) return;
  const passwords = getLocalPasswords();
  passwords[email] = password;
  localStorage.setItem('beliseken_passwords', JSON.stringify(passwords));
}

// Register user
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}): Promise<{ success: boolean; error?: string; user?: User }> {
  // Try API first
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      const user: User = {
        ...result.data,
        addresses: result.data.addresses || [],
        createdAt: result.data.createdAt || new Date().toISOString(),
      };
      setLocalSession(user);
      return { success: true, user };
    }
    
    return { success: false, error: result.error || 'Registration failed' };
  } catch (error) {
    console.warn('API register failed, using localStorage:', error);
    
    // Fallback to localStorage
    const users = getLocalUsers();
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'Email sudah terdaftar!' };
    }
    
    const newUser: User = {
      id: String(Date.now()),
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveLocalUsers(users);
    saveLocalPassword(data.email, data.password);
    setLocalSession(newUser);
    
    return { success: true, user: newUser };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Try API first
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      const user: User = {
        ...result.data,
        addresses: result.data.addresses || [],
        createdAt: result.data.createdAt || new Date().toISOString(),
      };
      setLocalSession(user);
      return { success: true, user };
    }
    
    return { success: false, error: result.error || 'Login failed' };
  } catch (error) {
    console.warn('API login failed, using localStorage:', error);
    
    // Fallback to localStorage
    const passwords = getLocalPasswords();
    if (passwords[email] !== password) {
      return { success: false, error: 'Email atau password salah!' };
    }
    
    const users = getLocalUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'Akun tidak ditemukan!' };
    }
    
    setLocalSession(user);
    return { success: true, user };
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return getLocalSession();
}

// Logout
export function logoutUser() {
  setLocalSession(null);
}

// Check if logged in
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// Get default address
export function getDefaultAddress(): UserAddress | null {
  const user = getCurrentUser();
  if (!user) return null;
  return user.addresses.find(a => a.isDefault) || user.addresses[0] || null;
}

// Save address
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
  
  // Update in users list
  const users = getLocalUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveLocalUsers(users);
  }
  
  // Try API
  try {
    await fetch(`${API_BASE}/auth/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, ...address }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {}
  
  return newAddress;
}

// Get all customers (admin)
export async function getAllCustomers(): Promise<User[]> {
  // Try API first
  try {
    const response = await fetch(`${API_BASE}/admin/customers`, {
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
  } catch {}
  
  // Fallback to localStorage
  return getLocalUsers();
}
