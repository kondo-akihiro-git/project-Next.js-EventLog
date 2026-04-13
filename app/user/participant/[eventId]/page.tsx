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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/event/${eventId}`);
      const data = await res.json();
      setEvent(data);
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <div>loading...</div>;

  const handleSubmit = async () => {
    if (!userName.trim()) {
      setError(true);
      return;
    }

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
    setError(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          {/* タイトル（同好会名） */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
            <Typography sx={{ mx: 2 }}>
              {event.clubName}
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
          </Box>

          {/* イベント名 */}
          <Typography sx={{ lineHeight: 1.4 }}>
            イベント名: {event.eventName}
          </Typography>

          {/* 主催者（行間詰める） */}
          <Typography sx={{ lineHeight: 1.2 }}>
            主催者: {event.ownerName}
          </Typography>

          {/* 入力 */}
          <TextField
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setError(false);
            }}
            fullWidth
            required
            error={error}
            helperText={error ? "参加者名は必須です" : ""}
            label="参加者名  ( 例：山田太郎 )"
          />

          {/* ボタン */}
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            承認する
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}