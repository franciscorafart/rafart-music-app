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
  const files = [
    ['Synth', 'synth.mp3', 'synth', 0],
    ['Stick', 'stick.mp3', 'stick', 0],
    ['Drums', 'drums.mp3', 'drums', 0],
    ['Vox', 'vox.mp3', 'vox', 0],
    ['Guitars', 'guitar.mp3', 'guitar', 0],
  ];

  const res = [];

  try {
    for (const file of files) {
      const instrumentName = file[0];
      const filename = file[1];
      const instrumentKey = file[2];
      const start = file[3];
      const url = await retrieveFileUrlS3(filename, 86400);

      res.push({
        key: instrumentKey,
        name: instrumentName,
        url: url,
        start: start,
      })
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(`There was an error on S3: ${e}`),
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({instruments: res}),
  };
};