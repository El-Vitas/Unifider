import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const ImageUploadInterceptor = (destination: string) =>
  FileInterceptor('image', {
    storage: diskStorage({
      destination: `./uploads/${destination}`,
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      cb(null, allowedMimeTypes.includes(file.mimetype));
    },
  });
