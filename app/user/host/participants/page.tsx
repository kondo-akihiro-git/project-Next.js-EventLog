// app/pages/participants/page.tsx
"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, Divider } from "@mui/material";

type Participant = {
  userName: String;
};

export default function ParticipantsPage() {
  const [link, setLink] = useState("");
  const [participants, setParticipants] = useState<Participant[] | null>(null);

  // Paperにまとめるテキスト生成（さん付き）
  const getParticipantsText = () => {
    if (!participants) return "";
    const names = participants.map((p) => `${p.userName} さん`).join("\n");
    return `＜参加者＞\n${names}\n`;
  };

  const handleShowParticipants = async () => {
  // リンクからeventIdを抜く想定（仮で固定でもOK）
  const eventId = link.split("/").pop(); // 仮処理

  if (!eventId) return;

  const data = await fetchParticipants(eventId);
  setParticipants(data);
};

  const handleCopy = () => {
    const text = getParticipantsText();
    navigator.clipboard.writeText(text);
    alert("参加者一覧をコピーしました");
  };

  const fetchParticipants = async (eventId: string) => {
  const res = await fetch(`/api/participant/${eventId}`);
  return res.json();
};

  return (
    <Box sx={{ p: 4}}>
      <Typography variant="h4" gutterBottom>
        参加者一覧ページ
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="発行されたリンクを入力"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleShowParticipants}
          disabled={!link}
        >
          参加者一覧を表示
        </Button>

        {participants && (
          <Paper sx={{ p: 2, mt: 2, whiteSpace: "pre-wrap" }}>
            <Typography>以下、承認済みの参加者</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>{getParticipantsText()}</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={handleCopy}
            >
              コピー
            </Button>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
