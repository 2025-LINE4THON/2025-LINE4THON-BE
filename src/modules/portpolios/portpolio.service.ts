import { prisma } from "../../config/database";

interface CreatePortfolioInput {
  userId: string;
  title: string;
  description?: string;
  projectIds: string[];
  careerIds: string[];
  skillIds: string[];
}

export const createPortfolio = async (data: CreatePortfolioInput) => {
  const { userId, title, description, projectIds, careerIds, skillIds } = data;

  // 1️⃣ 유효성 검사
const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) throw new Error('User not found');

  // 2️⃣ 포트폴리오 생성 및 연결
  const portfolio = await prisma.portfolio.create({
    data: {
      title,
      description,
      userId,
      projects: { connect: projectIds.map(id => ({ id })) },
      careers: { connect: careerIds.map(id => ({ id })) },
      skills: { connect: skillIds.map(id => ({ id })) },
    },
    include: { projects: true, careers: true, skills: true },
  });

  return portfolio;
};
