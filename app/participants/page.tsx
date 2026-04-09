// app/pages/participants/page.tsx
"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, Divider } from "@mui/material";

type Participant = {
  name: string;
};

// テストデータ
const TEST_PARTICIPANTS: Participant[] = [
  { name: "山田太郎" },
  { name: "佐藤花子" },
  { name: "鈴木一郎" },
];

export default function ParticipantsPage() {
  const [link, setLink] = useState("");
  const [participants, setParticipants] = useState<Participant[] | null>(null);

  // Paperにまとめるテキスト生成（さん付き）
  const getParticipantsText = () => {
    if (!participants) return "";
    const names = participants.map((p) => `${p.name} さん`).join("\n");
    return `＜参加者＞\n${names}\n`;
  };

  const handleShowParticipants = () => {
    // 本来はリンクからイベントIDなど取得してAPIで取得
    setParticipants(TEST_PARTICIPANTS);
  };

  const handleCopy = () => {
    const text = getParticipantsText();
    navigator.clipboard.writeText(text);
    alert("参加者一覧をコピーしました");
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
