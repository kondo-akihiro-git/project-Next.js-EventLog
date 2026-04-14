"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

export default function HomePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
        <Typography sx={{ mx: 2 }}>
          同好会参加記録の作成手順
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
      </Box>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography>① 同好会を開催</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography>② 開催者がリンクを作成</Typography>
            <Typography variant="body2">
              開催者の方には、専用のページで必要事項を入力していただき、参加者がアクセスするためのリンクを発行してもらいます。
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography>③ 参加者がリンクから参加申請</Typography>
            <Typography variant="body2">
              参加者はリンクを開き、名前を入力して参加申請を送ります。
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography>④ マネージャーが参加記録を確認</Typography>
            <Typography variant="body2">
              マネージャーの方は専用ページから過去の参加記録を一覧で確認できます。
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}