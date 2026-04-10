// app/pages/host/page.tsx
"use client";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Paper } from "@mui/material";
import Link from "next/link";

export default function HostPage() {
  const params = useSearchParams();
  const key = params.get("key");
  const [clubName, setClubName] = useState("");
  const [eventName, setEventName] = useState("");
  const [hostName, setHostName] = useState("");
  const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [link, setLink] = useState("");


  if (key !== process.env.NEXT_PUBLIC_HOST_KEY) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="error">
          アクセス不可
        </Typography>
      </Box>
    );
  }

  const handleGenerateLink = async () => {
    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubName,
          eventName,
          hostName,
          eventDate: eventDate?.toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        throw new Error("保存失敗");
      }

      const data = await res.json();

      //DBのidを使ってURL生成
      const newLink = `${window.location.origin}/user/participant/${data.id}`;
      setLink(newLink);

      alert("リンク発行＆保存完了");
    } catch (error) {
      console.error(error);
      alert("エラー発生");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    alert("リンクをコピーしました");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        同好会開催者の方へ
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="同好会名"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          fullWidth
        />

        <TextField
          label="開催者名"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          fullWidth
        />

        <TextField
          label="開催したイベント名"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          fullWidth
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
          <DatePicker
            label="開催日"
            value={eventDate}
            onChange={(newValue) => setEventDate(newValue)}
            format="MM/DD"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>

        <Button variant="contained" onClick={handleGenerateLink}>
          リンク発行
        </Button>

        {link && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography sx={{ wordBreak: "break-all" }}>{link}</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
              onClick={handleCopy}
            >
              コピー
            </Button>
          </Paper>
        )}
        <Button
          component={Link}
          href="host/participants?key=k2m9n8p7q1"
          variant="outlined"
          sx={{ mt: 2, width: "fit-content" }}
        >
          承認いただいた参加者一覧を表示する
        </Button>
      </Stack>
    </Box>
  );
}