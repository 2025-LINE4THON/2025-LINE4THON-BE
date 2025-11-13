import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { success } from '../../common/common.response';
import { UserService } from './user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // 내 정보 조회
  getMyInfo = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const user = await this.userService.getMyInfo(userId);
    res.json(success(user, '내 정보 조회 성공'));
  });

  // 내 정보 수정
  updateMyInfo = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const updatedUser = await this.userService.updateMyInfo(userId, req.body);
    res.json(success(updatedUser, '내 정보 수정 성공'));
  });

  // 내 경력 목록 조회
  getMyCareers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const careers = await this.userService.getMyCareers(userId);
    res.json(success(careers, '내 경력 목록 조회 성공'));
  });

  // 내 자격증 목록 조회
  getMyLicenses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const licenses = await this.userService.getMyLicenses(userId);
    res.json(success(licenses, '내 자격증 목록 조회 성공'));
  });

  // 내 스택 목록 조회
  getMyStacks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const stacks = await this.userService.getMyStacks(userId);
    res.json(success(stacks, '내 스택 목록 조회 성공'));
  });

  // 내 프로젝트 목록 조회
  getMyProjects = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const projects = await this.userService.getMyProjects(userId);
    res.json(success(projects, '내 프로젝트 목록 조회 성공'));
  });

  // 내 포트폴리오 목록 조회
  getMyPortfolios = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const portfolios = await this.userService.getMyPortfolios(userId);
    res.json(success(portfolios, '내 포트폴리오 목록 조회 성공'));
  });
}
