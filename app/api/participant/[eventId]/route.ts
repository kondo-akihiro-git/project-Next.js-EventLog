// app/api/participant/[eventId]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 参加承認の登録
export async function POST(req: Request) {
  try {
    const { eventId, userName } = await req.json();

    const participant = await prisma.participant.create({
      data: {
        eventId,
        userName,
        approved: true,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json(participant);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "approve failed" },
      { status: 500 }
    );
  }
}

// 承認済み参加者一覧取得
export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const participants = await prisma.participant.findMany({
    where: {
      eventId,
      approved: true,
    },
    orderBy: {
      approvedAt: "desc",
    },
  });

  return NextResponse.json(participants);
}