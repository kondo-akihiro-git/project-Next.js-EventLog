"use client";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import Link from "next/link";

export default function HostPage() {
  const params = useSearchParams();
  const key = params.get("key");

  const [clubName, setClubName] = useState("");
  const [eventName, setEventName] = useState("");
  const [hostName, setHostName] = useState("");
  const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [link, setLink] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  if (key !== process.env.NEXT_PUBLIC_HOST_KEY) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" color="error">
          アクセス不可
        </Typography>
      </Box>
    );
  }

  // ★追加：必須チェック
  const isValid =
    clubName.trim() !== "" &&
    eventName.trim() !== "" &&
    hostName.trim() !== "" &&
    eventDate !== null;

  const handleGenerateLink = async () => {
    // ★追加：未入力チェック
    if (!isValid) {
      showSnackbar("すべての項目を入力してください", "error");
      return;
    }

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
        throw new Error("保存失敗");
      }

      const data = await res.json();

      const newLink = `${window.location.origin}/user/participant/${data.id}`;
      setLink(newLink);

      showSnackbar("リンクを発行しました", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("エラーが発生しました", "error");
    }
  };

  const handleShare = async () => {
    if (!link) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "イベント参加リンク",
          text: "こちらから参加できます！",
          url: link,
        });
        showSnackbar("共有しました", "success");
      } else {
        await navigator.clipboard.writeText(link);
        showSnackbar("共有非対応のためコピーしました", "success");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("共有に失敗しました", "error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    showSnackbar("リンクをコピーしました", "success");
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
          <Typography sx={{ mx: 2 }}>
            同好会開催者の方向けページ
          </Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          こちらの画面でリンクを発行してください。
        </Box>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="同好会名"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            fullWidth
          />

          <TextField
            label="開催者名（例：山田太郎）"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            fullWidth
          />

          <TextField
            label="イベント名（例：勉強会）"
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
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            onClick={handleGenerateLink}
            disabled={!isValid}
          >
            リンク発行
          </Button>

          {link && (
            <>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography sx={{ wordBreak: "break-all" }}>
                  {link}
                </Typography>
                <Box sx={{ p: 2 }}></Box>

                <Typography
                  sx={{
                    // color: "success.main",
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  作成したリンクを参加者に共有してください。
                </Typography>
                <Typography
                  sx={{
                    // color: "error.main",
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  開催者本人はリンクから承認する必要はありません。
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="outlined" size="small" onClick={handleCopy}>
                    コピー
                  </Button>

                  <Button variant="outlined" size="small" onClick={handleShare}>
                    SNSで共有
                  </Button>
                </Stack>

              </Paper>
            </>
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