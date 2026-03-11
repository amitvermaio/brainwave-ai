import { Pinecone } from '@pinecone-database/pinecone';
import config from './config.js';

const pinecone = new Pinecone({
  apiKey: config.pineconeApiKey,
});

const pineconeIndex = pinecone.index(config.pineconeIndexName);

export { pinecone, pineconeIndex };
