import pLimit from 'p-limit';
import multer from 'multer';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import {
  ACCESS_KEY,
  SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME
} from '../configs/envConfig';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
  region: AWS_REGION,
});

const storage = multer.memoryStorage(); // store image in memory
const upload = multer({ storage: storage }); //name is for what is on the BE and maxCount is for how many they can give you

// Limit concurrent uploads to 5 at a time
const limit = pLimit(5);

const uploadToS3 = async (file: Express.Multer.File) => {
  const uniqueKey = `${file.originalname}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME!,
    Key: uniqueKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  // Return the S3 URL
  return uniqueKey;
};

const retrieveS3Url = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME!, // name of the bucket
    Key: fileKey, // name of the file in S3
  });

//   Generate a signed URL for the file so users can have controlled access. 7 days expiry
  const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 });
  return url;
};

// Upload multiple files with concurrency control
// const uploadMultipleToS3 = async (files: Express.Multer.File[]) => {
//     const uploadPromises = files.map((file) =>
//         limit(() => uploadToS3(file.buffer, file.originalname, file.mimetype))
//     );

//     const urls = await Promise.all(uploadPromises);
//     return urls;
// };

// Delete a file from S3
const deleteFromS3 = async (fileKey: string) => {
  const command = new DeleteObjectCommand({
    Bucket: AWS_BUCKET_NAME!,
    Key: fileKey,
  });

  await s3Client.send(command);
};

export { upload, uploadToS3, deleteFromS3, retrieveS3Url };
