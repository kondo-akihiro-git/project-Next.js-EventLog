# アプリ名：同好会参加記録アプリ（EventLog）

## アプリ概要

同好会開催にあたっての参加記録を管理するWebアプリです。  
同好会開催者の方がイベントを作成し、参加者がリンク経由で参加申請を行うことで記録できます。
マネージャーの方は専用の画面から誰がいつどの同好会に参加したのか確認することができます。

主な特徴：
- イベント作成・参加リンク発行
- 参加者の申請・承認フロー
- 参加者一覧の管理
- RDS(PostgreSQL)によるデータ管理
- AWS(ECS + ALB + RDS + Route53)で本番運用

---

## 主な画面

- `ホーム画面` : アプリの入口となる画面

<kbd><img width="1394" alt="home" src="https://github.com/user-attachments/assets/d5121d62-237a-4ad7-9fbc-41616e9216ec" /></kbd>
</br></br>

- `開催者画面` : イベント作成と参加リンク発行を行う画面

<kbd><img width="1394" alt="host" src="https://github.com/user-attachments/assets/placeholder-host" /></kbd>
</br></br>

- `参加者画面` : イベントリンクから参加申請を行う画面

<kbd><img width="1382" alt="participant" src="https://github.com/user-attachments/assets/placeholder-participant" /></kbd>
</br></br>

- `参加者一覧画面` : 承認済み参加者の確認画面

<kbd><img width="1387" alt="list" src="https://github.com/user-attachments/assets/placeholder-list" /></kbd>
</br></br>

---

## フォルダ構成

- `app/`
  - `api/` : APIルート
  - `admin/` : 開催者画面  
  - `host/` : 開催者画面
  - `user/` : 参加者画面
  - `page.tsx` : ホーム画面

- `prisma/`
  - `schema.prisma` : DBスキーマ定義
  - `migrations/` : マイグレーション履歴

- `public/` : 静的ファイル
- `Dockerfile.prod` : 本番用Docker設定
- `docker-compose.prod.yml` : ローカル検証用（Postgres + Web）
- `package.json` : 依存関係・起動スクリプト
- `.env` : 環境変数設定

---

## 主な技術要件

- Next.js : フロントエンド / APIルート
- MUI(Material UI) : UIコンポーネント
- Prisma : ORM（PostgreSQL連携）
- PostgreSQL : データベース（RDS / ローカルDocker）
- Docker : ローカル環境構築

---

## インフラ構成

- ECS(Fargate) : アプリ実行
- ECR : Dockerイメージ保存
- RDS(PostgreSQL) : 本番DB
- ALB : HTTPS公開
- Route53 : ドメイン管理

---

## 環境変数

### DB
DATABASE_URL={<RDS_ENDPOINT>含むPostgreSQLのURL>}

### 認証キー（例）
NEXT_PUBLIC_ADMIN_KEY=<UUID>
NEXT_PUBLIC_HOST_KEY=<UUID>
NEXT_PUBLIC_MANAGER_KEY=<UUID>

---

## デプロイ手順

1. Dockerでローカル動作確認
2. Dockerイメージをビルド
3. ECRへpush
4. ECSタスク定義作成とサービス起動
5. ALB作成
6. ドメイン購入とRoute53でドメイン紐付け
7. HTTPS(ACM)設定
8. 本番公開
