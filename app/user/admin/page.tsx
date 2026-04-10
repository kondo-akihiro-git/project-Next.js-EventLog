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

  // 選択状態（フィルタ関係なく保持）
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

  // 承認人数
  const enriched = useMemo(() => {
    return events.map((e) => ({
      ...e,
      approvedCount: e.participants.filter((p) => p.approvedAt).length,
    }));
  }, [events]);

  // フィルタ
  const filtered = useMemo(() => {
    if (!onlyNoApproved) return enriched;
    return enriched.filter((e) => e.approvedCount === 0);
  }, [enriched, onlyNoApproved]);

  // ページング
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

  // 削除
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">管理者ページ</Typography>

      <Stack direction="row" spacing={2} sx={{ my: 2 }}>
        <label>
          <input
            type="checkbox"
            checked={onlyNoApproved}
            onChange={(e) => {
              setOnlyNoApproved(e.target.checked);
              setPage(0);
            }}
          />
          承認なしのみ
        </label>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={selected.size === 0}
        >
          削除
        </Button>
      </Stack>

      <Paper>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell width="10%">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={toggleAll}
                />
              </TableCell>

              <TableCell width="18%">日付</TableCell>
              <TableCell width="18%">同好会</TableCell>
              <TableCell width="18%">イベント名</TableCell>
              <TableCell width="18%">作成者</TableCell>
              <TableCell width="18%">承認人数</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((e) => (
              <TableRow
                key={e.id}
                hover
                selected={selected.has(e.id)}
                sx={{
                  backgroundColor:
                    e.approvedCount === 0 ? "#ffe5e5" : "inherit",
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selected.has(e.id)}
                    onChange={() => toggleOne(e.id)}
                  />
                </TableCell>

                <TableCell>{formatDate(e.eventDate)}</TableCell>
                <TableCell>{e.clubName}</TableCell>
                <TableCell>{e.eventName}</TableCell>
                <TableCell>{e.ownerName}</TableCell>
                <TableCell>{e.approvedCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* pagination */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          前へ
        </Button>

        <Typography>
          {page + 1} / {Math.ceil(filtered.length / rowsPerPage)}
        </Typography>

        <Button
          disabled={(page + 1) * rowsPerPage >= filtered.length}
          onClick={() => setPage((p) => p + 1)}
        >
          次へ
        </Button>
      </Stack>
    </Box>
  );
}