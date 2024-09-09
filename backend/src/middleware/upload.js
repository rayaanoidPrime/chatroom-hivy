import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { AppError } from "../utils/errorHandler.js";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Invalid file type. Only JPEG, PNG, GIF images and MP4, QuickTime videos are allowed.",
          400
        )
      );
    }
  },
});

export const uploadMiddleware = (fieldName) => {
  return async (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next();
      }

      try {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        req.fileUrl = fileUrl;
        next();
      } catch (error) {
        next(new AppError("Error uploading file", 500));
      }
    });
  };
};
