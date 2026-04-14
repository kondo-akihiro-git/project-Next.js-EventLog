memo



docker run --name pg-test -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=mydb -p 5432:5432 -d postgres

DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

通知をポップに変更

<Stack spacing={1}>
          <Chip
            label="管理者: http://localhost:3000/user/admin?key=a9f8d7g6h5"
            variant="outlined"
          />
          <Chip
            label="ホスト: http://localhost:3000/user/host?key=k2m9n8p7q1"
            variant="outlined"
          />
          <Chip
            label="マネージャー: http://localhost:3000/user/manager?key=w3x4y5z6v2"
            variant="outlined"
          />
        </Stack>
      </Paper>