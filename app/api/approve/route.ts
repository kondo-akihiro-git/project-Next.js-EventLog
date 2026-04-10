import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { participantId } = await req.json();

    const updated = await prisma.participant.update({
      where: { id: participantId },
      data: {
        approved: true,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "approve failed" },
      { status: 500 }
    );
  }
}