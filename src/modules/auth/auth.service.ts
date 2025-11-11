import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput } from './auth.dto';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  // 회원가입
  async register(data: RegisterInput) {
    // 사용자 존재 여부 확인
    const existingUser = await this.authRepository.findByUsername(data.username);

    if (existingUser) {
      throw new AppError('이미 존재하는 사용자명입니다.', 400);
    }

    // 이메일 중복 확인
    if (data.email) {
      const existingEmail = await this.authRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new AppError('이미 사용 중인 이메일입니다.', 400);
      }
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 사용자 생성
    const user = await this.authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  // 로그인
  async login(data: LoginInput) {
    // 사용자 찾기
    const user = await this.authRepository.findByUsername(data.username);

    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', 401);
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('비밀번호가 일치하지 않습니다.', 401);
    }

    // Access Token 생성 (15분)
    const accessToken = jwt.sign(
      { userId: user.userId, username: user.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Refresh Token 생성 (7일)
    const refreshToken = jwt.sign(
      { userId: user.userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );

    // 비밀번호 제외하고 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  // Refresh Token으로 Access Token 재발급
  async refresh(refreshToken: string) {
    try {
      // Refresh Token 검증
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        userId: number;
      };

      // 사용자 확인
      const user = await this.authRepository.findById(String(decoded.userId));

      if (!user) {
        throw new AppError('사용자를 찾을 수 없습니다.', 401);
      }

      // 새로운 Access Token 발급
      const newAccessToken = jwt.sign(
        { userId: user.userId, username: user.username },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
      );

      return { accessToken: newAccessToken };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError('유효하지 않은 Refresh Token입니다.', 401);
    }
  }
}
