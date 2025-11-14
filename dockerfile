# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# corepack enable (pnpm 제공)
RUN corepack enable

# package + lock 먼저 복사 (빌드 캐시 최적화)
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치 (dev 포함, 빌드용)
# --frozen-lockfile: lockfile과 정확히 일치
RUN pnpm install --frozen-lockfile

# 소스 복사 (Prisma 스키마 포함)
COPY . .

# Prisma Client 생성
RUN pnpm exec prisma generate

# 빌드 (package.json에 "build" 스크립트가 있어야 함)
RUN pnpm run build

# ---------- production stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# corepack enable
RUN corepack enable

# production 의존성만 설치 (앱 실행에 필요한 것들)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Prisma 스키마 및 마이그레이션 복사 (런타임에 필요)
COPY --from=builder /app/prisma ./prisma

# Prisma Client 복사 (pnpm 구조)
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

# 빌드된 산출물 복사
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# 시작 스크립트 생성 (마이그레이션 적용)
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "Applying database migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting server..."' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# 엔트리포인트
CMD ["/app/start.sh"]
