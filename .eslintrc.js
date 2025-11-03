// .eslintrc.js
module.exports = {
  // 1. 현재 폴더를 ESLint root로 설정
  root: true,

  // 2. ESLint가 TypeScript를 "이해"하도록 parser 설정
  parser: '@typescript-eslint/parser',

  // 3. ESLint 플러그인 설정
  plugins: ['@typescript-eslint/eslint-plugin'],

  // 4. (가장 중요) 기본 규칙 + TS 규칙 + Prettier 충돌 방지 설정
  extends: [
    'eslint:recommended', // ESLint의 기본 추천 규칙
    'plugin:@typescript-eslint/recommended', // TypeScript 추천 규칙
    'plugin:prettier/recommended', // (필수!) Prettier 규칙을 ESLint에 포함시킴
  ],

  // 5. Node.js 환경임을 명시 (Node.js 전역 변수/스코프 인식)
  env: {
    node: true,
  },

  // 6. 린트 검사에서 제외할 파일/폴더
  ignorePatterns: [
    '.eslintrc.js', // 이 설정 파일 자체는 검사 안 함
    'dist/', // 빌드된 JS 파일은 검사 안 함
  ],

  // 7. 여기서 세부 규칙을 끄거나 켤 수 있습니다. (옵션)
  rules: {
    // 예: 'any' 타입을 명시적으로 써야 할 때 경고 (기본은 error)
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
