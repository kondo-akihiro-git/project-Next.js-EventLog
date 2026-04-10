// app/api/event/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// イベント登録
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { clubName, eventName, hostName, eventDate } = body;

    const event = await prisma.event.create({
      data: {
        clubName,
        eventName,
        ownerName: hostName,
        eventDate: eventDate ? new Date(eventDate) : new Date(),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "登録失敗" }, { status: 500 });
  }
}

// イベント一覧の取得
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        participants: true,
      },
      orderBy: {
        eventDate: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "fetch failed" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { ids }: { ids: string[] } = body;

    await prisma.event.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "削除失敗" }, { status: 500 });
  }
}