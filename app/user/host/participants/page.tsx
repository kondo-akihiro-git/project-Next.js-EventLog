"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Stack, Divider } from "@mui/material";

type Participant = {
  userName: string;
};

type ApiResponse = {
  event: {
    ownerName: string;
  };
  participants: Participant[];
};

export default function ParticipantsPage() {
  const [link, setLink] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getParticipantsText = () => {
    if (!data) return "";

    const { event, participants } = data;

    const ownerLine = `${event.ownerName} さん`;

    const participantLines = participants
      .map((p) => `${p.userName} さん`)
      .join("\n");

    return `＜参加者＞\n${ownerLine}\n${participantLines}\n`;
  };

  const handleShowParticipants = async () => {
    const eventId = link.split("/").pop();
    if (!eventId) return;

    try {
      setError(null);

      const res = await fetch(`/api/participant/${eventId}`);

      if (!res.ok) {
        throw new Error("データ取得失敗");
      }

      const json = await res.json();

      // eventが無いケースも弾く
      if (!json.event) {
        throw new Error("イベントが見つかりませんでした");
      }

      setData(json);
    } catch (e) {
      console.error(e);
      setData(null);
      setError("データの取得に失敗しました。リンクが正しいか確認してください。");
    }
  };

  const handleCopy = () => {
    const text = getParticipantsText();
    navigator.clipboard.writeText(text);
    alert("参加者一覧をコピーしました");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
        <Typography sx={{ mx: 2 }}>
          参加者一覧ページ
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
      </Box>

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

        {/* ❗ エラー表示 */}
        {error && (
          <Typography sx={{ color: "red" }}>
            ※ {error}
          </Typography>
        )}

        {/* 成功時のみ表示 */}
        {data && (
          <Paper sx={{ p: 2, mt: 2, whiteSpace: "pre-wrap" }}>
            <>
              <Typography>以下、承認済みの参加者</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{getParticipantsText()}</Typography>
            </>

            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={handleCopy}
            >
              コピー
            </Button>
          </Paper>
        )}

        {/* データなし＆エラーなしの初期状態 */}
        {!data && !error && (
          <Typography sx={{ color: "#666" }}>
            ※ リンクを入力して参加者一覧を取得してください
          </Typography>
        )}
      </Stack>
    </Box>
  );
}