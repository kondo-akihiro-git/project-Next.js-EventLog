memo



docker run --name pg-test -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=mydb -p 5432:5432 -d postgres

DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"