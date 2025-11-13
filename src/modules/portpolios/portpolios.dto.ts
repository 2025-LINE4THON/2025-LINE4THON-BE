import { z } from 'zod';

// Template enum (API 명세: standard | visual)
export const TemplateEnum = z.enum(['STANDARD', 'IMAGE']);

// Visibility enum (API 명세: public | private | link)
export const VisibilityEnum = z.enum(['PUBLIC', 'PRIVATE', 'LINK']);

// Skill 입력 스키마
const SkillInputSchema = z.object({
  id: z.number(),
  rank: z.number(),
});

// Career 입력 스키마
const CareerInputSchema = z.object({
  id: z.number(),
  description: z.string(),
});

const AboutMeSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// Portfolio 생성 DTO (API 명세에 맞춤)
export const CreatePortfolioDto = z.object({
  template: TemplateEnum, // API 명세: template
  skills: z.array(SkillInputSchema).optional(), // API 명세: skills (id, rank)
  careers: z.array(CareerInputSchema).optional(), // API 명세: careers (id, description)
  projectIds: z.array(z.number()).optional(), // API 명세: projectIds
  title: z.string().min(1, '제목은 필수입니다'),
  greeting: z.string().optional(), // API 명세: greeting
  introduction: z.string().optional(), // API 명세: Introduction (대문자 I)
  aboutMe: z.array(AboutMeSchema).optional(), // API 명세: aboutMe
  thumbnail: z.string().optional(), // API 명세: thumbnail
  isPublic: VisibilityEnum, // API 명세: isPublic (public | private | link)
});

// Portfolio 수정 DTO
export const UpdatePortfolioDto = z.object({
  template: TemplateEnum.optional(),
  skills: z.array(SkillInputSchema).optional(),
  careers: z.array(CareerInputSchema).optional(),
  projectIds: z.array(z.number()).optional(),
  title: z.string().min(1, '제목은 필수입니다').optional(),
  greeting: z.string().optional(),
  introduction: z.string().optional(),
  aboutMe: z.array(AboutMeSchema).optional(),
  thumbnail: z.string().optional(),
  isPublic: VisibilityEnum.optional(),
});

export type CreatePortfolioDtoType = z.infer<typeof CreatePortfolioDto>;
export type UpdatePortfolioDtoType = z.infer<typeof UpdatePortfolioDto>;

// Skill 입력 타입
export type SkillInput = z.infer<typeof SkillInputSchema>;

// Career 입력 타입
export type CareerInput = z.infer<typeof CareerInputSchema>;

// AboutMe 입력 타입
export type AboutMeInput = z.infer<typeof AboutMeSchema>;

// Portfolio 응답 DTO
export interface PortfolioResponseDto {
  portfolioId: number;
  userId: number;
  title: string;
  thumbnail?: string;
  template: 'IMAGE' | 'STANDARD';
  views: number;
  isPublic: 'PUBLIC' | 'PRIVATE' | 'LINK';
  greeting?: string;
  introduction?: string;
  aboutMe?: AboutMeInput[];
  createdAt: Date;
  updatedAt: Date;
}

// Stack 응답 DTO
export interface StackDto {
  stackId: number;
  name: string;
  level?: string;
  rank?: number; // PortfolioStack에서의 rank
}

// Career 응답 DTO
export interface CareerDto {
  careerId: number;
  content: string;
  startDate: Date;
  endDate?: Date;
  description?: string; // PortfolioCareer에서의 description
}

// Project 간단 응답 DTO
export interface ProjectDto {
  projectId: number;
  title: string;
  thumbnail?: string;
  role?: string;
  startDate: Date;
  endDate?: Date;
}

// Portfolio 상세 응답 DTO
export interface PortfolioDetailResponseDto {
  portfolioId: number;
  userId: number;
  title: string;
  thumbnail?: string;
  template: 'IMAGE' | 'STANDARD';
  views: number;
  isPublic: 'PUBLIC' | 'PRIVATE' | 'LINK';
  greeting?: string;
  introduction?: string;
  aboutMe?: AboutMeInput[];
  createdAt: Date;
  updatedAt: Date;
  stacks: StackDto[];
  careers: CareerDto[];
  projects: ProjectDto[];
}

// Portfolio 검색 파라미터
export interface PortfolioSearchParam {
  keyword?: string;
  sort?: 'recent' | 'views';
  template?: 'IMAGE' | 'STANDARD';
  isPublic?: 'PUBLIC' | 'PRIVATE' | 'LINK';
}