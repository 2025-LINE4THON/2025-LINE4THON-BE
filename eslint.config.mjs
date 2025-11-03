// eslint.config.js
import globals from 'globals'; // 'globals' 패키지
import eslint from '@eslint/js'; // ESLint 코어
import tseslint from 'typescript-eslint'; // TS-ESLint 통합 패키지
import eslintConfigPrettier from 'eslint-config-prettier'; // Prettier 충돌 방지

export default [
  // 1. ESLint의 기본 '추천' 규칙
  eslint.configs.recommended,

  // 2. TypeScript '추천' 규칙 (tseslint.configs.recommended)
  // v9+ 부터는 이렇게 배열로 펼쳐서 사용합니다.
  ...tseslint.configs.recommended,

  // 3. Node.js 환경의 전역 변수 설정 (globals.node)
  {
    languageOptions: {
      globals: {
        ...globals.node, // 'node: true'와 동일한 역할
      },
    },
  },

  // 4. (필수) Prettier 충돌 방지 설정
  // 이 설정은 항상 배열의 *가장 마지막*에 위치해야 합니다.
  eslintConfigPrettier,

  // 5. 린트 검사에서 제외할 파일/폴더 설정
  {
    ignores: ['dist/', 'node_modules/', 'eslint.config.js'],
  },
];