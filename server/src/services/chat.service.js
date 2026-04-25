import OpenAI from 'openai';
import config from '../config/config.js';

export const MODELS = {
  normal: 'nvidia/nemotron-3-super-120b-a12b:free',  
  fast: 'openai/gpt-oss-120b:free',                    
}

const SYSTEM_PROMPTS = {
  normal: `You are Brainwave AI — friendly and smart. Keep answers short, clear, and easy to read. Only answer what's asked. Use simple words and a line break between points. Leave the user wanting to explore more, not overwhelmed.`,

  fast: `You are Brainwave AI — quick and clear. Answer only what's asked, nothing extra. Short sentences, easy words, clean format.`,
};

const openai = new OpenAI({
  baseURL: config.openrouterUrlEndpoint,
  apiKey: config.openrouterApiKey,
});

const history = [];

export const getAvailableModels = () => {
  return Object.entries(MODELS).map(([modelType, modelId]) => ({
    modelType,
    modelId
  }));
};

export const generateResponseFromModel = async (query, modelType = 'normal') => {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS[modelType] ?? SYSTEM_PROMPTS.normal },
      ...history,
      { role: 'user', content: query }
    ];

    const completion = await openai.chat.completions.create({
      model: MODELS[modelType] || MODELS.normal,
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