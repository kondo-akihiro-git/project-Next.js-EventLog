// app/page.tsx
import Link from "next/link";
import { Box, Typography, List, ListItem, Button } from "@mui/material";

export default function HomePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        ホームページ
      </Typography>

      <List>
        <ListItem>
          <Link href="/admin?key=a9f8d7g6h5" passHref>
            <Button variant="contained" color="primary">
              管理者ページ
            </Button>
          </Link>
        </ListItem>

        <ListItem>
          <Link href="/host?key=k2m9n8p7q1" passHref>
            <Button variant="contained" color="secondary">
              ホストページ
            </Button>
          </Link>
        </ListItem>

        <ListItem>
          <Link href="/manager?key=w3x4y5z6v2" passHref>
            <Button variant="contained" color="success">
              マネージャーページ
            </Button>
          </Link>
        </ListItem>
      </List>
    </Box>
  );
}