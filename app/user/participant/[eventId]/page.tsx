"use client";

import { use, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

export default function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);

  const [event, setEvent] = useState<any>(null);
  const [userName, setUserName] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/event/${eventId}`);
      const data = await res.json();
      setEvent(data);
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <div>loading...</div>;

  // ★開催者画面と同じ形式のバリデーション
  const isValid = userName.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid) {
      showSnackbar("参加者名は必須です", "error");
      return;
    }

    try {
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

      showSnackbar("承認完了", "success");
      setUserName("");
    } catch (error) {
      console.error(error);
      showSnackbar("エラーが発生しました", "error");
    }
  };

  return (
    <>
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

            {/* 主催者 */}
            <Typography sx={{ lineHeight: 1.2 }}>
              主催者: {event.ownerName}
            </Typography>

            {/* 入力 */}
            <TextField
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              label="参加者名  ( 例：山田太郎 )"
            />

            {/* ボタン */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              承認する
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Snackbar（開催者と完全統一） */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}