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

RUN pnpm approve-builds @prisma/client @prisma/engines prisma bcrypt
RUN pnpm exec prisma generate

# 소스 복사
COPY . .

# 빌드 (package.json에 "build" 스크립트가 있어야 함)
RUN pnpm run build

# ---------- production stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# production 의존성만 설치 (앱 실행에 필요한 것들)
# 복사한 package.json으로 production 설치
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile --prod

# 빌드된 산출물만 복사
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# 엔트리(프로젝트에 따라 조정)
CMD ["node", "dist/index.js"]
