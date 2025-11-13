import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { successResponse, createdResponse } from '../../common/common.response';
import { AuthService } from './auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // 회원가입
  signup = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.signup(req.body);
    createdResponse(res, user, '회원가입이 완료되었습니다.');
  });

  // 로그인
  login = asyncHandler(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await this.authService.login(req.body);
    
    // Access Token은 응답 body에, Refresh Token은 httpOnly Cookie에 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    successResponse(res, { user, accessToken }, 200, '로그인 성공');
  });

  // Access Token 갱신
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh Token이 없습니다.');
    }

    const { accessToken } = await this.authService.refresh(refreshToken);
    successResponse(res, { accessToken }, 200, '토큰 갱신 성공');
  });

  // 로그아웃
  logout = asyncHandler(async (req: Request, res: Response) => {
    // 프론트에서 localStorage에서 토큰을 삭제하므로 서버에서는 성공 응답만 반환
    successResponse(res, null, 200, '로그아웃 성공');
  });

  // 아이디 중복 확인
  checkId = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.checkId(req.body);
    
    if (result.success) {
      res.status(200).json({
        message: result.message,
        data: {
          success: result.success,
        },
        statusCode: 200,
      });
    } else {
      res.status(400).json({
        message: result.message,
        data: {
          success: result.success,
        },
        statusCode: 400,
      });
    }
  });
}
