import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, BrainCircuit, CheckCircle2, Send, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';

const MODELS = [
  {
    id: 'mistral-7b-instruct',
    name: 'Mistral 7B Instruct',
    provider: 'Mistral AI',
    bestFor: 'Fast everyday Q&A',
    description: 'Great for quick summaries, brainstorming, and concise explanations.',
    accent: 'from-sky-500 to-cyan-500',
    strengths: ['Speed', 'Clean answers', 'Lower latency'],
  },
  {
    id: 'llama-3-8b-instruct',
    name: 'Llama 3 8B Instruct',
    provider: 'Meta',
    bestFor: 'Balanced reasoning',
    description: 'Strong all-rounder for deeper reasoning and structured step-by-step replies.',
    accent: 'from-emerald-500 to-teal-500',
    strengths: ['Reasoning', 'Structure', 'Versatility'],
  },
  {
    id: 'qwen-2.5-7b-instruct',
    name: 'Qwen 2.5 7B Instruct',
    provider: 'Alibaba',
    bestFor: 'Coding and technical prompts',
    description: 'Performs well on technical tasks, code explanations, and API-oriented questions.',
    accent: 'from-amber-500 to-orange-500',
    strengths: ['Code help', 'Math', 'Technical depth'],
  },
];

const buildMockResponse = (model, userQuestion) => {
  return `### ${model.name} response\n\nYou asked: **${userQuestion}**\n\nI am optimized for **${model.bestFor}**. Here is a polished starter answer:\n\n1. Clarify the goal in one sentence.\n2. Break the topic into small sub-parts.\n3. Use examples to validate understanding.\n4. End with an action checklist for execution.\n\n#### Suggested next move\nPick one sub-part and ask me for a deep dive with examples.`;
};

const GeneralChat = () => {
  const [selectedModelId, setSelectedModelId] = useState(MODELS[1].id);
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Welcome to General Chat. Select any open-source model and ask questions not tied to documents. I can answer in markdown, structured lists, and concise explanations.',
      createdAt: new Date().toISOString(),
    },
  ]);

  const selectedModel = useMemo(
    () => MODELS.find((model) => model.id === selectedModelId) || MODELS[0],
    [selectedModelId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding]);

  const sendMessage = (questionText) => {
    const cleaned = questionText.trim();
    if (!cleaned || isResponding) return;

    const userMessage = {
      role: 'user',
      content: cleaned,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsResponding(true);

    window.setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: buildMockResponse(selectedModel, cleaned),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsResponding(false);
    }, 700);
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
                UI Demo Mode
              </span>
            </div>

            <div className='flex gap-2 overflow-x-auto pb-1'>
              {MODELS.map((model) => {
                const selected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    type='button'
                    onClick={() => setSelectedModelId(model.id)}
                    className={`group min-w-52.5 rounded-2xl border px-3 py-2 text-left transition-all duration-200 ${
                      selected
                        ? 'border-transparent bg-linear-to-r from-teal-50 to-cyan-50 shadow-sm shadow-teal-100 ring-1 ring-teal-200'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <p className='truncate text-xs font-semibold text-slate-900'>{model.name}</p>
                        <p className='truncate text-[11px] text-slate-500'>Best for: {model.bestFor}</p>
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
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${selectedModel.accent} shadow-md`}>
                <BrainCircuit className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-sm font-semibold text-slate-900'>{selectedModel.name}</p>
                <p className='text-xs text-slate-500'>Best for: {selectedModel.bestFor} • {selectedModel.provider}</p>
              </div>
            </div>
            <div className='flex items-center gap-1.5'>
              {selectedModel.strengths.map((strength) => (
                <span
                  key={strength}
                  className='rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600'
                >
                  {strength}
                </span>
              ))}
            </div>
            <div className={`hidden items-center gap-2 rounded-xl bg-linear-to-r ${selectedModel.accent} px-3 py-1.5 text-white shadow-sm sm:inline-flex`}>
              <Bot className='h-3.5 w-3.5' />
              <span className='text-xs font-semibold'>Open Source</span>
            </div>
          </div>

          <div className='min-h-0 flex-1 overflow-y-auto bg-linear-to-b from-slate-50/70 via-white to-slate-50/30 px-4 py-5 sm:px-6'>
            <div className='mx-auto flex max-w-4xl flex-col gap-4'>
                {messages.map((messageItem, index) => {
                  const isUser = messageItem.role === 'user';
                  return (
                    <article
                      key={`${messageItem.createdAt}-${index}`}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.18s_ease-out]`}
                    >
                      {!isUser && (
                        <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${selectedModel.accent} shadow-sm`}>
                          <Bot className='h-4 w-4 text-white' />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${
                          isUser
                            ? 'rounded-br-md bg-linear-to-r from-slate-900 to-slate-800 text-white shadow-slate-300/30'
                            : 'rounded-bl-md border border-slate-200/80 bg-white/95 text-slate-800 shadow-slate-200/60'
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
                    </article>
                  );
                })}

                {isResponding && (
                  <div className='flex items-center gap-3'>
                    <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${selectedModel.accent} shadow-sm`}>
                      <Bot className='h-4 w-4 text-white' />
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
                disabled={!input.trim() || isResponding}
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
