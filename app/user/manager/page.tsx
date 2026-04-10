// app/user/manager/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
} from "@mui/material";

type Participant = {
  id: string;
  userName: string;
  approvedAt: string;
  event: {
    id: string;
    eventName: string;
    eventDate: string;
  };
};

export default function ManagerPage() {
  const params = useSearchParams();
  const key = params.get("key");

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yyyy}/${mm}/${dd}`;
  };

  // 認証
  if (key !== process.env.NEXT_PUBLIC_MANAGER_KEY) {
    return <h1>アクセス不可</h1>;
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/participant");
      const data = await res.json();
      setParticipants(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // 🔍 フィルタ処理（名前検索）
  const filtered = useMemo(() => {
    return participants.filter((p) =>
      p.userName.toLowerCase().includes(filter.toLowerCase())
    );
  }, [participants, filter]);

  // 📄 ページング
  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        マネージャーページ
      </Typography>

      {/* 🔍 検索 */}
      <Stack direction="row" sx={{ mb: 2 }}>
        <TextField
          label="ユーザー名で検索"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
          fullWidth
        />
      </Stack>

      {/* 📊 テーブル */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "20%" }}>日付</TableCell>
              <TableCell sx={{ width: "40%" }}>同好会</TableCell>
              <TableCell sx={{ width: "40%" }}>ユーザー</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((p) => (
              <TableRow key={p.id}>
                <TableCell sx={{ width: "20%" }}>
                  {formatDate(p.event.eventDate)}
                </TableCell>

                <TableCell sx={{ width: "40%" }}>
                  {p.event.eventName}
                </TableCell>

                <TableCell sx={{ width: "40%" }}>
                  {p.userName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 ページネーション */}
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