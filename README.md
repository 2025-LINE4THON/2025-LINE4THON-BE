# 2025-LINE4THON-BE
멋쟁이사자처럼 13기 4호선톤 포트폴리스팀, 백엔드 레포지토리입니다.

## 서비스 소개


## 🚀 기술 스택

- **Runtime**: Node.js v20
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (개발), PostgreSQL (프로덕션 권장)
- **Authentication**: JWT + bcrypt
- **Package Manager**: pnpm

## 📦 설치 및 실행

### 1. 패키지 설치
```bash
pnpm install
```

### 2. 환경변수 설정
`.env.example`을 복사하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

그 후 `.env` 파일에서 필요한 값들을 수정할 것.

### 3. 데이터베이스 마이그레이션
```bash
pnpm prisma migrate dev
```

### 4. 개발 서버 실행
```bash
pnpm dev
```

### 5. 프로덕션 빌드
```bash
pnpm build
pnpm start
```

## 📁 프로젝트 구조

```

src/
├── common/                      # 공통 레이어 (3계층 아키텍처 베이스 클래스)
│   ├── common.repository.ts    # Repository 레이어 추상 클래스
│   ├── common.service.ts       # Service 레이어 추상 클래스
│   ├── common.controller.ts    # Controller 레이어 추상 클래스
│   └── response.ts             # API 응답 헬퍼 함수
├── config/                      # 환경 설정
│   ├── env.ts                  # 환경변수 설정
│   └── database.ts             # Prisma 클라이언트 싱글톤
├── middleware/                  # Express 미들웨어
│   ├── errorHandler.ts         # 전역 에러 핸들러
│   ├── asyncHandler.ts         # 비동기 에러 래퍼
│   └── authenticate.ts         # JWT 인증 미들웨어
└── modules/                     # 기능별 모듈
    ├── auth/                   # 인증 모듈
    │   ├── auth.controller.ts  # 라우트 핸들러
    │   ├── auth.service.ts     # 비즈니스 로직
    │   └── auth.routes.ts      # 라우트 정의
    ├── users/                  # 사용자 관리 (예정)
    ├── portfolios/             # 포트폴리오 (예정)
    ├── projects/               # 프로젝트 (예정)
    ├── licenses/               # 자격증 (예정)
    ├── careers/                # 경력 (예정)
    ├── stacks/                 # 기술 스택 (예정)
    └── utils/                  # 순수 헬퍼 함수 모음
        ├── validation.utils.ts # 데이터 검증 (Zod)
        ├── date.utils.ts       # 날짜/시간 처리
        ├── string.utils.ts     # 문자열 처리
        ├── index.ts            # 통합 export
        └── examples.ts         # 사용 예시
```

### 🏗️ 3계층 아키텍처 패턴

각 모듈은 **Repository → Service → Controller** 의 간편화된 클린-아키텍쳐 구조:

```
module/
├── module.repository.ts  # 데이터 접근 계층 (CommonRepository 상속)
├── module.service.ts     # 비즈니스 로직 계층 (CommonService 상속)
├── module.controller.ts  # HTTP 요청/응답 처리 계층 (CommonController 상속)
└── module.routes.ts      # 라우트 정의
```

**계층별 역할:**
- **Repository**: DB 접근 로직, Prisma 쿼리
- **Service**: 비즈니스 로직, 도메인 규칙
- **Controller**: HTTP 요청/응답 변환, 에러 핸들링

## 깃 컨벤션
```
1. 브랜치 전략
- main : 배포 서버 연결 브랜치
- develop : 구현 상황 통합 관리
- 개인별 브랜치 : 이슈별 / 개인별 기능별 별도 브랜치 관리

2. 이슈 전략
- 기능별, 작업별 이슈 생성
- 이슈 번호 기반 develop 브랜치에 merge

3. 커밋 규칙
Feat : 새로운 기능 생성
Fix : 버그, 오류 등 기능 수정
Init : 초기 세팅
Refactor : 기능 구조 변경
Delete : 기능 or 파일 삭제