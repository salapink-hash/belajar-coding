import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  name?: string;
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterUserInput) {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("email sudah terdaftar");
  }

  // 2. Hash password menggunakan bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Simpan user baru ke database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { success: true };
}

export async function loginUser({ email, password }: LoginUserInput) {
  // 1. Cari data user di tabel users berdasarkan email
  const userList = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const [user] = userList;

  if (!user) {
    throw new Error("email atau password salah");
  }

  // 2. Cek kecocokan password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("email atau password salah");
  }

  // 3. Generate token UUID baru
  const token = crypto.randomUUID();

  // 4. Simpan ke tabel sessions
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
}

export async function getCurrentUser(token: string) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  const [user] = result;

  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
  };
}


