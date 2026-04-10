// app/api/event/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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