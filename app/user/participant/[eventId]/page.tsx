"use client";

import { use, useEffect, useState } from "react";
import { Box, Paper, Stack, Typography, TextField, Button } from "@mui/material";

export default function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);

  const [event, setEvent] = useState<any>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/event/${eventId}`);
      const data = await res.json();
      setEvent(data);
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <div>loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5">
            イベント名: {event.eventName}
          </Typography>

          <Typography>同好会: {event.clubName}</Typography>
          <Typography>主催者: {event.ownerName}</Typography>

          <TextField
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            label="参加者名 (例: 山田太郎)"
          />

          <Button
            variant="contained"
            onClick={async () => {
              await fetch(`/api/participant/${eventId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  eventId,
                  userName,
                }),
              });

              alert("承認完了");
              setUserName("");
            }}
          >
            承認する
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}