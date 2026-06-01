import { config } from 'dotenv';
config();

import { PrismaClient } from '@prisma/client';

console.log("URL:", process.env.DATABASE_URL); // To verify what it sees

const prisma = new PrismaClient();

async function test() {
  try {
    console.log("🐘 Testing database connection...");
    const clientCount = await prisma.client.count();
    console.log(`✅ Success! Found ${clientCount} clients in the database.`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
