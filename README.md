# 同好会参加記録アプリ（EventLog）

## アプリ概要

同好会開催にあたっての参加記録を管理するWebアプリです。  
同好会開催者の方がイベントを作成し、参加者がリンク経由で参加申請を行うことで記録できます。
マネージャーの方は専用の画面から誰がいつどの同好会に参加したのか確認することができます。

</br>

主な機能
- 同好会イベントの作成
- 参加リンクの発行
- 参加者の参加申請
- 参加者一覧の管理

---

## 主な画面

- `開催者向け画面` : 同好会イベント作成画面

<kbd><img alt="同好会開催者ページ" src="https://github.com/user-attachments/assets/edb366d5-c3ea-4178-b56f-8fd5171e334f" /></kbd>
</br></br>

- `開催者向け画面` : 参加リンク発行画面（開催者の方が参加者の方に向けてリンクを共有）

<kbd><img width="830" height="657" alt="リンク発行" src="https://github.com/user-attachments/assets/3a46f1ec-8587-4a5a-9745-a624ae0b25f9" /></kbd>
</br></br>

- `参加者向け画面` : 作成されたリンクを通して参加申請

<kbd><img width="825" height="316" alt="承認" src="https://github.com/user-attachments/assets/e86d0aa7-58f7-4e9e-83bf-5147e930e710" /></kbd>
</br></br>

- `開催者向け画面` : 参加者一覧の確認画面

<kbd><img width="930" height="482" alt="参加者一覧ページ" src="https://github.com/user-attachments/assets/e633a0b0-162d-4746-b571-a36ebb24e3ae" /></kbd>
</br></br>

- `マネージャー向け画面` : 全同好会と参加者の検索画面（名前や時期で検索できる）

<kbd><img width="944" height="831" alt="マネージャー" src="https://github.com/user-attachments/assets/1e64bb1f-9f39-4e8d-95cd-aa49189b7743" /></kbd>
</br></br>

- `管理者向け画面` : 同好会イベント一覧の確認画面

<kbd><img width="990" height="724" alt="管理者" src="https://github.com/user-attachments/assets/1ee16667-0bf6-4369-9325-9aa874abe402" /></kbd>
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
DATABASE_URL={RDSのエンドポイント含むPostgreSQLのURL>}

### 認証キー（例）
NEXT_PUBLIC_ADMIN_KEY=UUID</br>
NEXT_PUBLIC_HOST_KEY=UUID</br>
NEXT_PUBLIC_MANAGER_KEY=UUID</br>

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
