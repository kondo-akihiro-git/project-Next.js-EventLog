<!-- ローカル各画面のURL -->
http://localhost:3000/user/admin?key=a9f8d7g6h5
http://localhost:3000/user/host?key=k2m9n8p7q1
http://localhost:3000/user/manager?key=w3x4y5z6v2


・開発
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml down

・本番
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml down

・スキーマ修正
docker compose -f docker-compose.dev.yml exec web npx prisma migrate dev
docker compose -f docker-compose.prodyml exec web npx prisma migrate dev