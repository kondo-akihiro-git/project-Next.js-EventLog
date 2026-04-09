// app/pages/admin/page.tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function AdminPage() {
  const params = useSearchParams();
  const key = params.get("key");

  if (key !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
    return <h1>アクセス不可</h1>;
  }

  return <h1>管理者トップページ</h1>;
}