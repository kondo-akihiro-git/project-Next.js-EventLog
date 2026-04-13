"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Stack,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";

type Participant = {
  id: string;
  approvedAt: string | null;
};

type Event = {
  id: string;
  clubName: string;
  eventName: string;
  eventDate: string;
  ownerName: string;
  participants: Participant[];
};

export default function AdminPage() {
  const params = useSearchParams();
  const key = params.get("key");

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [onlyNoApproved, setOnlyNoApproved] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (key !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
    return <h1>アクセス不可</h1>;
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/event");
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const enriched = useMemo(() => {
    return events.map((e) => ({
      ...e,
      approvedCount: e.participants.filter((p) => p.approvedAt).length,
    }));
  }, [events]);

  const filtered = useMemo(() => {
    if (!onlyNoApproved) return enriched;
    return enriched.filter((e) => e.approvedCount === 0);
  }, [enriched, onlyNoApproved]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  const isAllSelected =
    paginated.length > 0 &&
    paginated.every((e) => selected.has(e.id));

  const isIndeterminate =
    paginated.some((e) => selected.has(e.id)) && !isAllSelected;

  const toggleAll = () => {
    const newSet = new Set(selected);
    if (isAllSelected) {
      paginated.forEach((e) => newSet.delete(e.id));
    } else {
      paginated.forEach((e) => newSet.add(e.id));
    }
    setSelected(newSet);
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const formatDate = (d: string) => {
    const dt = new Date(d);
    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(
      dt.getDate()
    )} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;

    await fetch("/api/event", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });

    setEvents((prev) =>
      prev.filter((e) => !selected.has(e.id))
    );

    setSelected(new Set());
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <Box sx={{ p: 2 }}>
      {/* タイトル（線） */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
        <Typography sx={{ mx: 2 }}>
          管理者ダッシュボード
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#ccc" }} />
      </Box>

      {/* 操作 */}
      <Stack
        direction="row"
        sx={{
          mb: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={onlyNoApproved}
              onChange={(e) => {
                setOnlyNoApproved(e.target.checked);
                setPage(0);
              }}
            />
          }
          label="承認人数が0人のイベントのみ表示"
        />

        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={handleDelete}
          disabled={selected.size === 0}
        >
          削除
        </Button>
      </Stack>

      {/* テーブル */}
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: "max-content" }}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Table
              sx={{
                borderCollapse: "collapse",
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
                  {["", "日付", "同好会", "イベント名", "作成者", "承認人数"].map(
                    (h, i) => (
                      <TableCell
                        key={i}
                        sx={{ border: "1px solid #e0e0e0" }}
                      >
                        {h === "" ? (
                          <Checkbox
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onChange={toggleAll}
                          />
                        ) : (
                          h
                        )}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginated.map((e) => (
                  <TableRow key={e.id} hover selected={selected.has(e.id)}>
                    <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                      <Checkbox
                        checked={selected.has(e.id)}
                        onChange={() => toggleOne(e.id)}
                      />
                    </TableCell>

                    <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                      {formatDate(e.eventDate)}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                      {e.clubName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                      {e.eventName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                      {e.ownerName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                      {e.approvedCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>

      {/* ページング */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          前へ
        </Button>

        <Typography>
          {page + 1} / {Math.ceil(filtered.length / rowsPerPage)}
        </Typography>

        <Button
          size="small"
          disabled={(page + 1) * rowsPerPage >= filtered.length}
          onClick={() => setPage((p) => p + 1)}
        >
          次へ
        </Button>
      </Stack>
    </Box>
  );
}