import { Request, Response } from 'express';
import { UploadService } from './upload.service';

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  // 이미지 업로드
  uploadImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: '파일이 업로드되지 않았습니다',
          data: null,
          statusCode: 400,
        });
      }

      const url = this.uploadService.getImageUrl(req.file.filename);

      res.status(200).json({
        message: '이미지 업로드 성공',
        data: { url },
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
        data: null,
        statusCode: 500,
      });
    }
  };

  // 다중 이미지 업로드
  uploadImages = async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          message: '파일이 업로드되지 않았습니다',
          data: null,
          statusCode: 400,
        });
      }

      const urls = req.files.map((file) => this.uploadService.getImageUrl(file.filename));

      res.status(200).json({
        message: '이미지 업로드 성공',
        data: { urls },
        statusCode: 200,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
        data: null,
        statusCode: 500,
      });
    }
  };
}
