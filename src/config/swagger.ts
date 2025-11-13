import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LikeLion Portfolio API',
      version: '1.0.0',
      description: '멋쟁이사자처럼 포트폴리오 API 문서',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'https://portpolis.site',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 토큰을 입력하세요 (Bearer 제외)',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: '에러 메시지',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/modules/**/*.routes.ts',
    './src/modules/**/*.route.ts',
    './src/modules/**/*.controller.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
