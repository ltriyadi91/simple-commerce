import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { env } from '../config/env-config';
import { generateS3KeyName } from '@/util/s3key.uitl';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToAws = async (fileName: string, filePath: string) => {
  try {
    let data;
    // Configure the parameters for the S3 upload
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: generateS3KeyName(fileName),
      Body: fs.createReadStream(filePath),
    };
    
    // Upload the file to S3
    await s3Client.send(new PutObjectCommand(uploadParams)).then(result => {
      // Delete the file from the local filesystem after successful upload
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, err => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted successfully.');
          }
        });
      }
      data = result;
    });

    return data;
  } catch (err) {
    return 'error';
  }
};

// Export function to get a signed URL for downloading a file from AWS S3
export const getFileUrlFromAws = async (fileName: string, expireTime: number) => {
  try {
    // Check if the file is available in the AWS S3 bucket
    const check = await isFileAvailableInAwsBucket(fileName);

    if (check) {
      const command = new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileName,
      });

      const url = await getSignedUrl(s3Client, command, expireTime ? {} : { expiresIn: expireTime });
      return url;
    } else {
      return 'error';
    }
  } catch (err) {
    // Handle any errors that occur during the process
    console.log('error', err);
    return 'error';
  }
};

export const isFileAvailableInAwsBucket = async (fileName: string) => {
  try {
    // Check if the object exists
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileName,
      }),
    );

    // If the object exists, return true
    return true;
  } catch (err) {
    console.error('Error checking object existence:', err);
    return false;
  }
};

export const deleteFileFromAws = async (fileName: string) => {
  try {
    // Configure the parameters for the S3 upload
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: fileName,
    };
    // Upload the file to S3
    await s3Client.send(new DeleteObjectCommand(uploadParams)).then(data => {});
  } catch (err) {
    console.error('Error ', err);
    return 'error';
  }
};
