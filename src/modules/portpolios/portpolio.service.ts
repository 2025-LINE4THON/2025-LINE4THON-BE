import { CommonService } from '../../common/common.service';
import { PortfolioRepository } from './portfolio.repository';
import { 
  PortfolioResponseDto,
  PortfolioDetailResponseDto,
  CreatePortfolioDtoType,
  UpdatePortfolioDtoType,
  PortfolioSearchParam
} from './portpolios.dto';

export class PortfolioService extends CommonService<PortfolioResponseDto> {
  private portfolioRepository: PortfolioRepository;

  constructor() {
    const repository = new PortfolioRepository();
    super(repository);
    this.portfolioRepository = repository;
  }

  // 포트폴리오 생성 (Relations 포함)
  async createPortfolio(userId: number, data: CreatePortfolioDtoType) {
    return this.portfolioRepository.createWithRelations(userId, data);
  }

  // 포트폴리오 수정 (Relations 포함)
  async updatePortfolio(
    portfolioId: number,
    userId: number,
    data: UpdatePortfolioDtoType
  ) {
    // 권한 확인
    const portfolio = await this.portfolioRepository.findByIdAndUserId(portfolioId, userId);
    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없거나 수정 권한이 없습니다');
    }

    return this.portfolioRepository.updateWithRelations(portfolioId, userId, data);
  }

  // 포트폴리오 삭제
  async deletePortfolio(portfolioId: number, userId: number) {
    // 권한 확인
    const portfolio = await this.portfolioRepository.findByIdAndUserId(portfolioId, userId);
    if (!portfolio) {
      throw new Error('포트폴리오를 찾을 수 없거나 삭제 권한이 없습니다');
    }

    return this.portfolioRepository.deletePortfolio(portfolioId);
  }

  // 사용자별 포트폴리오 목록 조회
  async getPortfoliosByUserId(userId: number): Promise<PortfolioResponseDto[]> {
    return this.portfolioRepository.findByUserId(userId);
  }

  // 포트폴리오 상세 조회 (조회수 증가)
  async getPortfolioDetail(portfolioId: number, userId?: number): Promise<PortfolioDetailResponseDto | null> {
    const portfolio = await this.portfolioRepository.findByIdWithRelations(portfolioId);
    
    if (portfolio) {
      // 조회수 증가 (비동기로 실행, 응답 지연 방지)
      this.portfolioRepository.incrementViews(portfolioId).catch(console.error);
      
      // 좋아요 여부 확인 (로그인한 경우)
      if (userId) {
        portfolio.isLiked = await this.portfolioRepository.isLiked(userId, portfolioId);
      }
    }

    return portfolio;
  }

  // 추천 포트폴리오 조회
  async getRecommendedPortfolios(userId?: number): Promise<PortfolioResponseDto[]> {
    const portfolios = await this.portfolioRepository.findRecommended();
    
    // 좋아요 여부 확인 (로그인한 경우)
    if (userId) {
      await Promise.all(
        portfolios.map(async (portfolio) => {
          portfolio.isLiked = await this.portfolioRepository.isLiked(userId, portfolio.portfolioId);
        })
      );
    }
    
    return portfolios;
  }

  // 포트폴리오 검색
  async searchPortfolios(params: PortfolioSearchParam, userId?: number): Promise<PortfolioResponseDto[]> {
    const portfolios = await this.portfolioRepository.searchPortfolios(
      params.keyword,
      params.sort,
      params.template,
      params.isPublic
    );
    
    // 좋아요 여부 확인 (로그인한 경우)
    if (userId) {
      await Promise.all(
        portfolios.map(async (portfolio) => {
          portfolio.isLiked = await this.portfolioRepository.isLiked(userId, portfolio.portfolioId);
        })
      );
    }
    
    return portfolios;
  }

  // 포트폴리오 필수 요소 확인
  async checkPortfolioRequirements(userId: number) {
    return this.portfolioRepository.checkRequirements(userId);
  }

  // 포트폴리오 좋아요
  async likePortfolio(userId: number, portfolioId: number) {
    // 이미 좋아요 했는지 확인
    const isLiked = await this.portfolioRepository.isLiked(userId, portfolioId);
    if (isLiked) {
      throw new Error('이미 좋아요한 포트폴리오입니다');
    }

    return this.portfolioRepository.likePortfolio(userId, portfolioId);
  }

  // 포트폴리오 좋아요 취소
  async unlikePortfolio(userId: number, portfolioId: number) {
    // 좋아요 했는지 확인
    const isLiked = await this.portfolioRepository.isLiked(userId, portfolioId);
    if (!isLiked) {
      throw new Error('좋아요하지 않은 포트폴리오입니다');
    }

    return this.portfolioRepository.unlikePortfolio(userId, portfolioId);
  }
}

