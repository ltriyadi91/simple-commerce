import { uploadFileToAws, getFileUrlFromAws } from '@/middleware/aws-s3.middleware';

export class ImageService {
  async uploadImages(images: any[]) {
    const uploadResults = [];
    for (const file of images) {
      const originalname = file.originalFilename;
      const path = file.filepath;
      if (!originalname || !path) {
        throw new Error('File name or path is missing');
      }
      const data = await uploadFileToAws(originalname, path);
      if (data) {
        uploadResults.push(originalname);
      }
    }
    return uploadResults;
  }

  async getSignedUrl(fileName: string, expiresIn: number) {
    return getFileUrlFromAws(fileName, expiresIn);
  }
}