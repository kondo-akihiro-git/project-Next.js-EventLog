// app/event/[eventId]/page.tsx
import { PrismaClient } from "@prisma/client";
import { Box, Paper, Stack, Typography } from "@mui/material";

const prisma = new PrismaClient();

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { participants: true },
  });

  if (!event) return <div>not found</div>;

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5">イベント名: {event.eventName}</Typography>
          <Typography>同好会: {event.clubName}</Typography>
          <Typography>主催者: {event.ownerName}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}