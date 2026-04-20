import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config = {
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  dbConnectionString: process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/learning_platform',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeIndexName: process.env.PINECONE_INDEX_NAME || 'ai-app',
  googleApiKey: process.env.GOOGLE_API_KEY,
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  azureStorageContainerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  resendApiKey: process.env.RESEND_API_KEY,
  resendFrom:   process.env.RESEND_FROM || 'onboarding@resend.dev',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

export default config;