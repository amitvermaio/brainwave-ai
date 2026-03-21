import config from "../config/config.js";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { pineconeIndex } from '../config/pinecone.js';

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.googleApiKey,
  model: "gemini-embedding-001",
});

export const llm = new ChatGoogleGenerativeAI({
  apiKey: config.googleApiKey,
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

export async function getRelevantChunks(userId, documentId, query, topK = 5) {
  const queryVector = await embeddings.embedQuery(query);

  const results = await pineconeIndex.namespace(userId).query({
    vector: queryVector,
    topK,
    filter: {
      documentId: { $eq: documentId },  
    },
    includeMetadata: true,
  });

  return results.matches.map(match => ({
    text: match.metadata.text,
    chunkIndex: match.metadata.chunkIndex,
    score: match.score,
  }))
}

export function buildContext(chunks) {
  return chunks.map(chunk => chunk.text).join('\n\n---\n\n');
}

export async function runChain(promptTemplate, variables) {
  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const chain = new RunnableSequence.from([prompt, llm, new StringOutputParser()]);
  return await chain.invoke(variables);
}