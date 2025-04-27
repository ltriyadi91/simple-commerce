import { Router } from 'express';
import { auth, authorizedRoles } from '@/middleware/auth.middleware';

import { ImageService } from '../services/image.service';
import { ImageController } from '../controllers/image.controller';

const imageService = new ImageService();
const imageController = new ImageController(imageService);

const router = Router();

router.post('/uploader', auth, authorizedRoles("ADMIN"), imageController.uploadProductImage);
router.post('/image', imageController.getAwsFileSignedUrl);

export default router;
