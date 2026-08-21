export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

const USERS_KEY = "beliseken_users";
const SESSION_KEY = "beliseken_user_session";

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
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveAllUsers(users);

  // Also store password separately (in real app, this would be hashed on server)
  const passwordsKey = "beliseken_passwords";
  try {
    const stored = localStorage.getItem(passwordsKey);
    const passwords: Record<string, string> = stored ? JSON.parse(stored) : {};
    passwords[data.email] = data.password;
    localStorage.setItem(passwordsKey, JSON.stringify(passwords));
  } catch {}

  // Auto login after register
  setSession(newUser);
  return { success: true };
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const passwordsKey = "beliseken_passwords";
  try {
    const stored = localStorage.getItem(passwordsKey);
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
