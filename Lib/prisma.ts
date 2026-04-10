// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Next.js の開発環境で PrismaClient を再生成しすぎないようにする
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;