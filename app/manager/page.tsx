// app/pages/manager/page.tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function ManagerPage() {
  const params = useSearchParams();
  const key = params.get("key");

  if (key !== process.env.NEXT_PUBLIC_MANAGER_KEY) {
    return <h1>アクセス不可</h1>;
  }

  return <h1>マネージャーページ</h1>;
}