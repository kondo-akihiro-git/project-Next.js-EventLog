// app/api/participant/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 一覧取得
export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
  include: {
    event: {
      select: {
        clubName: true,
        ownerName: true,
        eventDate: true,
      },
    },
  },
  orderBy: {
    approvedAt: "desc",
  },
});

    return NextResponse.json(participants);
  } catch (e) {
    return NextResponse.json(
      { error: "fetch failed" },
      { status: 500 }
    );
  }
}