# FROM node:20-slim

# WORKDIR /app

# # 👇 OpenSSL入れる（Debian用）
# RUN apt-get update && apt-get install -y openssl

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npx prisma generate

# CMD ["npm", "run", "dev"]