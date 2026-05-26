import mongoose from "mongoose";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing in environment variables`);
  }
  return value;
}

const MONGODB_URI = requireEnv("MONGODB_URI");

// Prevent multiple connections in dev
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "meet",
    });
  }

  cached.conn = await cached.promise;

  console.log("✅ MongoDB connected");
  return cached.conn;
}