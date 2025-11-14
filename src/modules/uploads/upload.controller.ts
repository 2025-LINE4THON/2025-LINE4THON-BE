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
          status: 'error',
          message: '파일이 업로드되지 않았습니다',
        });
      }

      const imageUrl = this.uploadService.getImageUrl(req.file.filename);

      res.status(200).json({
        status: 'success',
        data: {
          imageUrl,
          filename: req.file.filename,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  };

  // 다중 이미지 업로드
  uploadImages = async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: '파일이 업로드되지 않았습니다',
        });
      }

      const imageUrls = req.files.map((file) => ({
        imageUrl: this.uploadService.getImageUrl(file.filename),
        filename: file.filename,
      }));

      res.status(200).json({
        status: 'success',
        data: imageUrls,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  };
}
