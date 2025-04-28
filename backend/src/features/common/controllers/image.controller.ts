import { Request, Response, NextFunction } from 'express';
import { ImageService } from '../services/image.service';
import formidable from 'formidable';

export class ImageController {
  private imageService: ImageService;

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({
      maxFileSize: 3 * 1024 * 1024 * 1024,
      keepExtensions: true,
      multiples: true,
    });

    try {
      const [_, files] = await new Promise<[any, any]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      const images = Array.isArray(files.image) ? files.image : [files.image];
      const uploadResults = await this.imageService.uploadImagesToBucket(images);

      res.status(200).json({ success: true, files: uploadResults });
    } catch (error) {
      next(error);
    }
  };

  getAwsFileSignedUrl = async (req: Request, res: Response) => {
    try {
      const fileName = req.body.key;
      const url = await this.imageService.getSignedUrl(fileName, 3600);
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ message: 'Error in getting the signed url', error });
    }
  };
}