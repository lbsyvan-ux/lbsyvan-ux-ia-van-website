import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "fr-par", // Scaleway ou AWS Paris
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.AWS_ENDPOINT, // Nécessaire pour Scaleway
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Génère une URL signée pour uploader un fichier directement depuis le navigateur vers S3
 * (Évite de faire transiter le fichier lourd par le serveur Next.js)
 */
export async function getUploadUrl(fileName: string, contentType: string) {
  const key = `clients/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { url, key };
}

/**
 * Génère une URL de lecture sécurisée à durée limitée (15 min)
 */
export async function getDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
}
