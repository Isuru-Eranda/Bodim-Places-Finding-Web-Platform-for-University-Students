import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  forcePathStyle: true,
  region: process.env.SUPABASE_S3_REGION || "ap-southeast-1",
  endpoint: process.env.SUPABASE_STORAGE_ENDPOINT,
  // Use a provider function so credentials are resolved after dotenv has loaded
  credentials: () =>
    Promise.resolve({
      accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID,
      secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY,
    }),
});

// Construct a public URL for a Supabase storage object
export const getPublicUrl = (bucket, filename) =>
  `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
