export interface UserAddress {
  id: string;
  label: string; // "Rumah", "Kantor", dll
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  addresses: UserAddress[];
  createdAt: string;
}

const USERS_KEY = "beliseken_users";
const SESSION_KEY = "beliseken_user_session";
const PASSWORDS_KEY = "beliseken_passwords";

function getAllUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveAllUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}): { success: boolean; error?: string } {
  const users = getAllUsers();
  if (users.find((u) => u.email === data.email)) {
    return { success: false, error: "Email sudah terdaftar!" };
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
  saveAllUsers(users);

  // Store password
  try {
    const stored = localStorage.getItem(PASSWORDS_KEY);
    const passwords: Record<string, string> = stored ? JSON.parse(stored) : {};
    passwords[data.email] = data.password;
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  } catch {}

  setSession(newUser);
  return { success: true };
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  try {
    const stored = localStorage.getItem(PASSWORDS_KEY);
    const passwords: Record<string, string> = stored ? JSON.parse(stored) : {};
    if (passwords[email] !== password) {
      return { success: false, error: "Email atau password salah!" };
    }
  } catch {
    return { success: false, error: "Email atau password salah!" };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: "Akun tidak ditemukan!" };
  }

  setSession(user);
  return { success: true, user };
}

function setSession(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// ── Address Management ──

export function saveUserAddress(address: Omit<UserAddress, "id">): UserAddress {
  const user = getCurrentUser();
  if (!user) throw new Error("Not logged in");

  const newAddress: UserAddress = {
    ...address,
    id: String(Date.now()),
  };

  // If set as default, unset others
  if (newAddress.isDefault) {
    user.addresses = user.addresses.map((a) => ({ ...a, isDefault: false }));
  }

  user.addresses.push(newAddress);
  setSession(user);

  // Also update in users list
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveAllUsers(users);
  }

  return newAddress;
}

export function updateUserAddress(id: string, updates: Partial<UserAddress>): void {
  const user = getCurrentUser();
  if (!user) return;

  user.addresses = user.addresses.map((a) =>
    a.id === id ? { ...a, ...updates } : updates.isDefault ? { ...a, isDefault: false } : a
  );
  setSession(user);

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveAllUsers(users);
  }
}

export function deleteUserAddress(id: string): void {
  const user = getCurrentUser();
  if (!user) return;

  user.addresses = user.addresses.filter((a) => a.id !== id);
  setSession(user);

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    saveAllUsers(users);
  }
}

export function getDefaultAddress(): UserAddress | null {
  const user = getCurrentUser();
  if (!user) return null;
  return user.addresses.find((a) => a.isDefault) || user.addresses[0] || null;
}

// ── Admin: Get all users ──

export function getAllCustomers(): User[] {
  return getAllUsers();
}

export function deleteUser(id: string): boolean {
  const users = getAllUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveAllUsers(filtered);
  return true;
}
