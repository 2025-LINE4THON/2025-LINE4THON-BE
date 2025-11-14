import { UserRepository } from './user.repository';
import { UpdateMyInfoRequest, CreateUserLinkRequest, UpdateUserLinkRequest } from './user.dto';
import { AppError } from '../../middleware/errorHandler';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 내 정보 조회
  async getMyInfo(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', 404);
    }

    return user;
  }

  // 내 정보 수정
  async updateMyInfo(userId: number, data: UpdateMyInfoRequest) {
    // 사용자 존재 확인
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new AppError('사용자를 찾을 수 없습니다.', 404);
    }

    const updatedUser = await this.userRepository.updateUserInfo(userId, data);
    return updatedUser;
  }

  // 내 경력 목록 조회
  async getMyCareers(userId: number) {
    return this.userRepository.findMyCareers(userId);
  }

  // 내 자격증 목록 조회
  async getMyLicenses(userId: number) {
    return this.userRepository.findMyLicenses(userId);
  }

  // 내 스택 목록 조회
  async getMyStacks(userId: number) {
    return this.userRepository.findMyStacks(userId);
  }

  // 내 프로젝트 목록 조회
  async getMyProjects(userId: number) {
    return this.userRepository.findMyProjects(userId);
  }

  // 내 포트폴리오 목록 조회
  async getMyPortfolios(userId: number) {
    return this.userRepository.findMyPortfolios(userId);
  }

  // === UserLink 서비스 ===

  // 내 링크 목록 조회
  async getMyLinks(userId: number) {
    return this.userRepository.findMyLinks(userId);
  }

  // 링크 생성 (배열)
  async createLink(userId: number, data: CreateUserLinkRequest) {
    return this.userRepository.bulkUpdateLinks(userId, data.links);
  }

  // 링크 수정
  async updateLink(userLinkId: number, userId: number, data: UpdateUserLinkRequest) {
    // 권한 확인
    const link = await this.userRepository.findLinkByIdAndUserId(userLinkId, userId);
    if (!link) {
      throw new AppError('링크를 찾을 수 없거나 수정 권한이 없습니다', 403);
    }

    return this.userRepository.updateLink(userLinkId, data);
  }

  // 링크 삭제
  async deleteLink(userLinkId: number, userId: number) {
    // 권한 확인
    const link = await this.userRepository.findLinkByIdAndUserId(userLinkId, userId);
    if (!link) {
      throw new AppError('링크를 찾을 수 없거나 삭제 권한이 없습니다', 403);
    }

    return this.userRepository.deleteLink(userLinkId);
  }
}
