import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  engine: "classic",
  datasource: {
    url: "file:./dev.db",  // 직접 SQLite 파일 경로 지정
  },
});