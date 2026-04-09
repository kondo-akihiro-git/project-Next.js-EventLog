# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# パッケージを先にコピーしてインストール（ビルド高速化）
COPY package*.json ./
RUN npm install

# デフォルトコマンド（開発サーバー起動）
CMD ["npm", "run", "dev"]