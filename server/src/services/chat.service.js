import OpenAI from 'openai';
import config from '../config/config.js';

export const MODELS = {
  general: 'meta-llama/llama-4-scout',
  code: 'mistralai/codestral-2508',
  complex: 'deepseek/deepseek-r1'
}

const SYSTEM_PROMPTS = {
  general: 'You are Brainwave AI, a helpful and concise assistant.',
  code: 'You are Brainwave AI, an expert coding assistant. Provide clean, well-commented code.',
  complex: 'You are Brainwave AI, a deep-reasoning assistant. Think step by step.',
};

const openai = new OpenAI({
  baseURL: config.openrouterUrlEndpoint,
  apiKey: config.openrouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": config.frontendUrl,
    "X-OpenRouter-Title": "Brainwave AI",
  }
});

const history = [];

export const getAvailableModels = () => {
  return Object.entries(MODELS).map(([modelType, modelId]) => ({
    modelType,
    modelId
  }));
};

export const generateResponseFromModel = async (query, modelType = 'general') => {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS[modelType] ?? SYSTEM_PROMPTS.general },
      ...history,
      { role: 'user', content: query }
    ];

    const completion = await openai.chat.completions.create({
      model: MODELS[modelType] || MODELS.general,
      messages: messages,
      max_tokens: 2048,
      temperature: 0.9,
    })

    const reply = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';

    history.push({ role: 'user', content: query });
    history.push({ role: 'assistant', content: reply });

    if (history.length > 10) {
      history.splice(0, 2);
    }

    return reply;

  } catch (error) {
    throw new Error('Error generating response from model: ' + error.message);
  }
}