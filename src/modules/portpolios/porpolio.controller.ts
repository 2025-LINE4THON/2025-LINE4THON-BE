import { Request, Response } from 'express';
import * as portfolioService from '@services/portfolio.service';
import { successResponse, errorResponse } from '../../common/common.response';

export const createPortfolio = async (req: Request, res: Response) => {
  try {
    const { userId, title, description, projectIds, careerIds, skillIds } = req.body;

    const newPortfolio = await portfolioService.createPortfolio({
      userId,
      title,
      description,
      projectIds,
      careerIds,
      skillIds,
    });

    return res.json(successResponse(res, newPortfolio, 201, '포트폴리오 생성 성공'));
  } catch (err) {
    return res.status(500).json(errorResponse(res,'포트폴리오 생성 실패', 500, err));
  }
};
