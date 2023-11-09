import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

const client = new S3Client({ 
  accessKeyId: process.env.IAM_ACCESS_ID,
  secretAccessKey: process.env.IAM_SECRET,
  region: 'us-east-2',
});

const retrieveFileUrlS3 = async (filename, expiry) => {

  const getParams = {
    Bucket: process.env.BUCKET,
    Key: filename,
    Expires: expiry || 60, // seconds
  };
  
  const command = new GetObjectCommand(getParams);
  return await getSignedUrl(client, command, { expiresIn: 3600 })
}

export const handler = async (event) => {
  try {
    const url  = await retrieveFileUrlS3('AlienationDanceExperienceShort.mp4', 86400);
    return {
      statusCode: 200,
      video: url
    };
    
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(`There was an error on S3: ${e}`),
    }
  }
};
