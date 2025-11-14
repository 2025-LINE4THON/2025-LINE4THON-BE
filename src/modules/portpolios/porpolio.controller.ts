import { Request, Response } from 'express';
import { CommonController } from '../../common/common.controller';
import { success, fail } from '../../common/common.response';
import { PortfolioService } from './portpolio.service';
import { PortfolioResponseDto, PortfolioSearchParam } from './portpolios.dto';

export class PortfolioController extends CommonController<PortfolioResponseDto> {
  private portfolioService: PortfolioService;

  constructor() {
    const portfolioService = new PortfolioService();
    super(portfolioService);
    this.portfolioService = portfolioService;
  }

  // 포트폴리오 생성 (Relations 포함) - API 명세에 맞춘 응답
  createPortfolio = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId; // authenticate middleware에서 설정
      if (!userId) {
        return res.status(401).json(fail('인증이 필요합니다'));
      }

      const portfolio = await this.portfolioService.createPortfolio(userId, req.body);
      
      // API 명세에 맞춘 응답 형식
      res.status(201).json({
        message: '포트폴리오 생성이 완료되었습니다.',
        data: {
          portpolioId: portfolio.portfolioId
        },
        statusCode: 201
      });
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 수정 (Relations 포함)
  updatePortfolio = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json(fail('인증이 필요합니다'));
      }

      const portfolioId = parseInt(req.params.id);
      const portfolio = await this.portfolioService.updatePortfolio(
        portfolioId,
        userId,
        req.body
      );
      res.json(success(portfolio, '포트폴리오가 수정되었습니다'));
    } catch (error: any) {
      if (error.message.includes('권한이 없습니다')) {
        return res.status(403).json(fail(error.message));
      }
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 삭제
  deletePortfolio = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json(fail('인증이 필요합니다'));
      }

      const portfolioId = parseInt(req.params.id);
      await this.portfolioService.deletePortfolio(portfolioId, userId);
      res.json(success(null, '포트폴리오가 삭제되었습니다'));
    } catch (error: any) {
      if (error.message.includes('권한이 없습니다')) {
        return res.status(403).json(fail(error.message));
      }
      res.status(500).json(fail(error.message));
    }
  };

  // 사용자별 포트폴리오 조회
  getByUserId = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const portfolios = await this.portfolioService.getPortfoliosByUserId(userId);
      res.json(success(portfolios, '사용자 포트폴리오 조회 성공'));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 상세 조회 (Relations 포함)
  getPortfolioDetail = async (req: Request, res: Response) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await this.portfolioService.getPortfolioDetail(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json(fail('포트폴리오를 찾을 수 없습니다'));
      }

      res.json(success(portfolio, '포트폴리오 상세 조회 성공'));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  // 추천 포트폴리오 조회
  getRecommended = async (req: Request, res: Response) => {
    try {
      const portfolios = await this.portfolioService.getRecommendedPortfolios();
      res.json(success(portfolios, '추천 포트폴리오 조회 성공'));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 검색
  searchPortfolios = async (req: Request, res: Response) => {
    try {
      const params: PortfolioSearchParam = {
        keyword: req.query.keyword as string,
        sort: (req.query.sort as 'recent' | 'views') || 'recent',
        template: req.query.template as 'IMAGE' | 'STANDARD' | undefined,
        isPublic: req.query.isPublic as 'PUBLIC' | 'PRIVATE' | 'LINK' | undefined,
      };

      const portfolios = await this.portfolioService.searchPortfolios(params);
      res.json(success(portfolios, '포트폴리오 검색 성공'));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 필수 요소 확인
  checkPortfolioRequirements = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json(fail('인증이 필요합니다'));
      }

      const requirements = await this.portfolioService.checkPortfolioRequirements(userId);
      res.json(success(requirements, '필수 요소 확인 성공'));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 좋아요
  likePortfolio = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json(fail('인증이 필요합니다'));
      }

      const portfolioId = parseInt(req.params.id);
      await this.portfolioService.likePortfolio(userId, portfolioId);
      res.json(success(null, '좋아요가 추가되었습니다'));
    } catch (error: any) {
      if (error.message.includes('이미 좋아요')) {
        return res.status(400).json(fail(error.message));
      }
      res.status(500).json(fail(error.message));
    }
  };

  // 포트폴리오 좋아요 취소
  unlikePortfolio = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json(fail('인증이 필요합니다'));
      }

      const portfolioId = parseInt(req.params.id);
      await this.portfolioService.unlikePortfolio(userId, portfolioId);
      res.json(success(null, '좋아요가 취소되었습니다'));
    } catch (error: any) {
      if (error.message.includes('좋아요하지 않은')) {
        return res.status(400).json(fail(error.message));
      }
      res.status(500).json(fail(error.message));
    }
  };
}