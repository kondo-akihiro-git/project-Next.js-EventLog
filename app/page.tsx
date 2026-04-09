// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>ホームページ</h1>
      <ul>
        <li>
          <Link href="/admin?key=a9f8d7g6h5">管理者ページ</Link>
        </li>
        <li>
          <Link href="/host?key=k2m9n8p7q1">ホストページ</Link>
        </li>
        <li>
          <Link href="/manager?key=w3x4y5z6v2">マネージャーページ</Link>
        </li>
      </ul>
    </div>
  );
}