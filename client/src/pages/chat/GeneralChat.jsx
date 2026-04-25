import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Check, CheckCircle2, Copy, Send, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import api from '../../config/axiosconfig';

const MODEL_UI = {
  normal: {
    name: 'Nemotron 3 Super 120B',
    provider: 'NVIDIA',
    bestFor: 'Balanced quality for everyday chat',
    accent: 'from-emerald-500 to-teal-500',
    strengths: ['Balanced', 'Clear answers', 'Reliable'],
    logoPath: '/nvidia-color.svg',
    logoPlate: 'bg-white ring-slate-300',
  },
  fast: {
    name: 'GPT-OSS 120B',
    provider: 'OpenAI',
    bestFor: 'Fast responses for quick tasks',
    accent: 'from-sky-500 to-cyan-500',
    strengths: ['Speed', 'Low latency', 'Quick drafts'],
    logoPath: '/openai.svg',
    logoPlate: 'bg-white ring-slate-300',
  },
};

const FALLBACK_MODELS = [
  { modelType: 'normal', modelId: 'nvidia/nemotron-3-super-120b-a12b:free' },
  { modelType: 'fast', modelId: 'openai/gpt-oss-120b:free' },
];

const toDisplayModel = ({ modelType, modelId }) => {
  const meta = MODEL_UI[modelType] || {};
  return {
    id: modelType,
    modelType,
    modelId,
    name: meta.name || modelId,
    provider: meta.provider || modelId?.split('/')[0] || 'Open Source',
    bestFor: meta.bestFor || 'General chat',
    accent: meta.accent || 'from-indigo-500 to-blue-500',
    strengths: meta.strengths || ['General use'],
    logoPath: meta.logoPath || '/vite.svg',
    logoPlate: meta.logoPlate || 'bg-slate-50 ring-slate-200',
  };
};

const GeneralChat = () => {
  const [models, setModels] = useState(FALLBACK_MODELS.map(toDisplayModel));
  const [selectedModelId, setSelectedModelId] = useState(FALLBACK_MODELS[0].modelType);
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState('');
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Welcome to General Chat. Select any open-source model and ask questions not tied to documents. I can answer in markdown, structured lists, and concise explanations.',
      modelType: 'normal',
      createdAt: new Date().toISOString(),
    },
  ]);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === selectedModelId) || models[0],
    [models, selectedModelId]
  );

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data } = await api.get('/ai/models');
        const modelList = (data?.data?.models || FALLBACK_MODELS).map(toDisplayModel);
        setModels(modelList);
        setSelectedModelId((prev) => prev || modelList[0]?.id || 'normal');
      } catch {
        setModels(FALLBACK_MODELS.map(toDisplayModel));
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding]);

  const copyMessage = async (messageId, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      window.setTimeout(() => {
        setCopiedMessageId((prev) => (prev === messageId ? '' : prev));
      }, 1200);
    } catch {
      setCopiedMessageId('');
    }
  };

  const sendMessage = async (questionText) => {
    const cleaned = questionText.trim();
    if (!cleaned || isResponding || !selectedModel) return;

    const userMessage = {
      role: 'user',
      content: cleaned,
      modelType: selectedModel.modelType,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsResponding(true);

    try {
      const { data } = await api.post('/ai/generate-response', {
        query: cleaned,
        modelType: selectedModel.modelType,
      });

      const responseText = data?.data?.response || 'Sorry, I could not generate a response.';
      const assistantMessage = {
        role: 'assistant',
        content: responseText,
        modelType: selectedModel.modelType,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallbackMessage = error?.response?.data?.message || error?.message || 'Failed to connect to AI service.';
      const assistantMessage = {
        role: 'assistant',
        content: `I could not generate a response right now. ${fallbackMessage}`,
        modelType: selectedModel.modelType,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className='relative h-[calc(100vh-7.5rem)] min-h-140'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(20,184,166,0.10),transparent_38%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.14),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.12),transparent_30%)]' />
      <div className='pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[18px_18px]' />

      <div className='relative mx-auto flex h-full max-w-7xl min-h-0 flex-col'>
        <section className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-300/25 backdrop-blur-xl'>
          <div className='border-b border-slate-200/90 bg-white px-4 py-3 sm:px-5'>
            <div className='mb-2 flex items-center justify-between'>
              <p className='inline-flex items-center gap-2 rounded-full border border-teal-100 bg-linear-to-r from-teal-50 to-cyan-50 px-3 py-1 text-[11px] font-semibold text-teal-700'>
                <Sparkles className='h-3.5 w-3.5' />
                General AI Chat
              </p>
              <span className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600'>
                Live API Mode
              </span>
            </div>

            <div className='flex gap-2 overflow-x-auto pb-1'>
              {models.map((model) => {
                const selected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    type='button'
                    onClick={() => setSelectedModelId(model.id)}
                    className={`group min-w-52.5 rounded-2xl border px-3 py-2 text-left transition-all duration-200 ${
                      selected
                        ? 'border-slate-300 bg-slate-50 shadow-sm ring-1 ring-slate-200'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0 flex items-start gap-2'>
                        <span className={`mt-0.5 rounded-md p-1 ring-1 shadow-sm ${model.logoPlate || 'bg-white ring-slate-300'}`}>
                          <img src={model.logoPath} alt={`${model.name} logo`} className='h-3.5 w-3.5 object-contain' />
                        </span>
                        <div className='min-w-0'>
                          <p className='truncate text-xs font-semibold text-slate-900'>{model.name}</p>
                          <p className='truncate text-[11px] text-slate-500'>Best for: {model.bestFor}</p>
                        </div>
                      </div>
                      {selected && <CheckCircle2 className='h-4 w-4 shrink-0 text-teal-600' />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3'>
            <div className='flex items-center gap-3'>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 shadow-sm ${selectedModel?.logoPlate || 'bg-white ring-slate-300'}`}>
                <img src={selectedModel?.logoPath || '/vite.svg'} alt={`${selectedModel?.name || 'Model'} logo`} className='h-5 w-5 object-contain' />
              </div>
              <div>
                <p className='text-sm font-semibold text-slate-900'>{selectedModel?.name}</p>
                <p className='text-xs text-slate-500'>Best for: {selectedModel?.bestFor} • {selectedModel?.provider}</p>
              </div>
            </div>
            <div className='flex items-center gap-1.5'>
              {(selectedModel?.strengths || []).map((strength) => (
                <span
                  key={strength}
                  className='rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600'
                >
                  {strength}
                </span>
              ))}
            </div>
            <div className='hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-3 py-1.5 text-white shadow-sm sm:inline-flex'>
              <Bot className='h-3.5 w-3.5' />
              <span className='text-xs font-semibold'>Open Source</span>
            </div>
          </div>

          <div className='min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-slate-50/70 via-white to-slate-50/30 px-4 py-5 sm:px-6'>
            <div className='mx-auto flex max-w-4xl flex-col gap-4'>
                {messages.map((messageItem, index) => {
                  const isUser = messageItem.role === 'user';
                  const itemModel = models.find((model) => model.modelType === messageItem.modelType) || selectedModel || models[0];
                  const messageId = `${messageItem.createdAt}-${index}`;
                  const copied = copiedMessageId === messageId;
                  return (
                    <article
                      key={messageId}
                      className={`flex items-start gap-3 my-2 ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.18s_ease-out]`}
                    >
                      {!isUser && (
                        <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 shadow-sm ${itemModel?.logoPlate || 'bg-white ring-slate-300'}`}>
                          <img src={itemModel?.logoPath || '/vite.svg'} alt={`${itemModel?.name || 'Model'} logo`} className='h-4 w-4 object-contain' />
                        </div>
                      )}

                      <div className={`flex max-w-[85%] flex-col ${isUser ? 'items-end' : 'items-start'} sm:max-w-[75%]`}>
                        <div
                          className={`max-w-lg rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                            isUser
                              ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md'
                              : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
                          }`}
                        >
                          {isUser ? (
                            <p>{messageItem.content}</p>
                          ) : (
                            <div className='prose prose-sm max-w-none prose-slate'>
                              <MarkdownRenderer content={messageItem.content} />
                            </div>
                          )}
                        </div>
                        <button
                          type='button'
                          onClick={() => copyMessage(messageId, messageItem.content)}
                          className={`mt-1 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors ${
                            isUser
                              ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {copied ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </article>
                  );
                })}

                {isResponding && (
                  <div className='flex items-center gap-3'>
                    <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 shadow-sm ${selectedModel?.logoPlate || 'bg-white ring-slate-300'}`}>
                      <img src={selectedModel?.logoPath || '/vite.svg'} alt={`${selectedModel?.name || 'Model'} logo`} className='h-4 w-4 object-contain' />
                    </div>
                    <div className='inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white/95 px-4 py-3 shadow-sm'>
                      <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]' />
                      <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]' />
                      <span className='h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]' />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </div>
          </div>

          <div className='p-5 border-t border-slate-200/60 bg-white/90 backdrop-blur'>
            <form onSubmit={handleSubmit} className='mx-auto flex max-w-4xl items-center gap-3'>
              <input
                type='text'
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder='Ask any general question...'
                className='flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/70 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-400 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10'
                disabled={isResponding}
              />
              <button
                type='submit'
                disabled={!input.trim() || isResponding || !selectedModel}
                className='shrink-0 w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:opacity-50'
              >
                <Send className='w-5 h-5 text-white' strokeWidth={2} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeneralChat;
