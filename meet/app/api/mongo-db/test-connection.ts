import "./env";

import { connectDB } from "./client";

async function testConnection() {
  try {
    await connectDB();
    console.log("🎉 Connection test successful");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();