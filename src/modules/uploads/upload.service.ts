import { env } from '../../config/env';

export class UploadService {
  // 이미지 URL 생성
  getImageUrl(filename: string): string {
    return `${env.SERVER_URL}/uploads/${filename}`;
  }
}
