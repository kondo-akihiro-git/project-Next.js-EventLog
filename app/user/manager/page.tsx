// app/user/manager/page.tsx
"use client";

export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";

type Participant = {
  id: string;
  userName: string; // ← これが「参加者」
  approvedAt: string | null;
  event: {
    clubName: string;   // 同好会名
    ownerName: string;  // 開催者名
    eventDate: string;
  };
};

export default function ManagerPage() {
  const [key, setKey] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [within8Months, setWithin8Months] = useState(false);

  // ✅ key取得
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setKey(params.get("key"));
  }, []);

  // ✅ データ取得（←ここを上に）
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/participant");
      const data = await res.json();

      if (Array.isArray(data)) {
        setParticipants(data);
      } else if (Array.isArray(data.participants)) {
        setParticipants(data.participants);
      } else {
        console.error("想定外のデータ形式", data);
        setParticipants([]);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  // ✅ useMemoも上
  const filtered = useMemo(() => {
    const now = new Date();
    const past = new Date();
    past.setMonth(past.getMonth() - 8);

    return participants.filter((p) => {
      const nameMatch =
  p.userName.toLowerCase().includes(filter.toLowerCase()) ||
  p.event.ownerName.toLowerCase().includes(filter.toLowerCase());

      if (!nameMatch) return false;

      if (!within8Months) return true;

      const eventDate = new Date(p.event.eventDate);
      return eventDate >= past && eventDate <= now;
    });
  }, [participants, filter, within8Months]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  // 🔥 ここから下に条件分岐
  if (key === null) return <p>読み込み中...</p>;

  if (key !== process.env.NEXT_PUBLIC_MANAGER_KEY) {
    return <h1>アクセス不可</h1>;
  }

  if (loading) return <p>読み込み中...</p>;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  };


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
        <Typography sx={{ mx: 2 }}>
          マネージャーの方向けページ
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
      </Box>

      <Stack direction="row" sx={{ mb: 2, alignItems: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={within8Months}
              onChange={(e) => {
                setWithin8Months(e.target.checked);
                setPage(0);
              }}
            />
          }
          label="現在から過去8ヶ月以内のイベントのみ表示"
        />
      </Stack>

      <Stack direction="row" sx={{ mb: 2 }}>
        <TextField
          label="名前で検索"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
          fullWidth
        />
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
  <TableRow>
    <TableCell sx={{ width: "25%" }}>日付</TableCell>
    <TableCell sx={{ width: "25%" }}>同好会名</TableCell>
    <TableCell sx={{ width: "25%" }}>参加者</TableCell>
    <TableCell sx={{ width: "25%" }}>開催者名</TableCell>
  </TableRow>
</TableHead>

          <TableBody>
  {paginated.map((p) => (
    <TableRow key={p.id}>
      <TableCell>
        {formatDate(p.event.eventDate)}
      </TableCell>

      <TableCell>
        {p.event.clubName}
      </TableCell>

      <TableCell>
        {p.userName}
      </TableCell>

      <TableCell>
        {p.event.ownerName}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Box>
  );
}