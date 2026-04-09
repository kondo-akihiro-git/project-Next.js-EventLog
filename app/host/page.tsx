// app/pages/host/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createLink } from "../logics/createLink";
import { Box, Typography, TextField, Button, Stack, Paper } from "@mui/material";
import Link from "next/link";

export default function HostPage() {
  const params = useSearchParams();
  const key = params.get("key");

  const [clubName, setClubName] = useState("");
  const [eventName, setEventName] = useState("");
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

  const handleGenerateLink = () => {
    const newLink = createLink(clubName, eventName);
    setLink(newLink);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    alert("リンクをコピーしました");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        ホストトップページ
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="同好会名"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          fullWidth
        />

        <TextField
          label="イベント名"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleGenerateLink}>
          Link発行
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
        <Link href="/participants?key=k2m9n8p7q1" passHref>
          <Button variant="outlined" sx={{ mt: 2 }}>
            参加者一覧を取得する
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}