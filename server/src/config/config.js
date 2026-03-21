import { config as dotenvConfig } from "dotenv";

// 2:47:12

dotenvConfig();

const _config = {
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
};

export default _config;