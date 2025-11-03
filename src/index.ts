import express, { Request, Response } from 'express';

const app = express();
const port = 3000; // 서버가 3000번 포트에서 실행

// GET 요청이 '/' 경로로 들어오면 실행
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, pnpm + TypeScript + Node.js!');
});

// 서버를 시작하고, 성공하면 로그 출력
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
