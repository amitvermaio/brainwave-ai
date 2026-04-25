import { useEffect, useRef, useState } from 'react';
import { Bot, MessagesSquare } from 'lucide-react';

const generalChatModels = [
  {
    name: 'Llama 4 Scout',
    provider: 'Meta',
    useCase: 'Fast everyday Q&A in General Chat',
    modelId: 'meta-llama/llama-4-scout',
    logo: '/meta-color.svg',
  },
  {
    name: 'Codestral 2508',
    provider: 'Mistral AI',
    useCase: 'Coding and technical prompts in General Chat',
    modelId: 'mistralai/codestral-2508',
    logo: '/mistral-color.svg',
  },
  {
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    useCase: 'Deep reasoning in General Chat',
    modelId: 'deepseek/deepseek-r1',
    logo: '/deepseek-color.svg',
  },
];

const documentAIModule = {
  name: 'Google Gemini',
  provider: 'Google',
  useCase: 'Document chat, summaries, flashcards, and quiz generation',
  modelId: 'Gemini-powered document AI pipeline',
  logo: '/gemini-color.svg',
  featured: true,
  capabilities: ['Chat', 'Summaries', 'Flashcards', 'Quiz'],
};

const ModelCard = ({ model, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`h-full rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        model.featured
          ? 'border-emerald-200 bg-linear-to-br from-emerald-50/70 via-white to-teal-50/60 hover:border-emerald-300'
          : 'border-slate-200 bg-white hover:border-emerald-300'
      }`}>
        <div className='mb-4 flex items-center gap-3'>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${
            model.featured ? 'bg-white ring-emerald-200' : 'bg-slate-50 ring-slate-200'
          }`}>
            <img src={model.logo} alt={`${model.name} logo`} className='h-6 w-6 object-contain' />
          </div>
          <div className='min-w-0'>
            <h3 className='truncate text-base font-bold text-slate-900'>{model.name}</h3>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-400'>{model.provider}</p>
          </div>
          {model.featured && (
            <span className='ml-auto rounded-full border border-emerald-200 bg-emerald-100/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700'>
              Primary Engine
            </span>
          )}
        </div>

        <p className='mb-3 text-sm leading-relaxed text-slate-600'>{model.useCase}</p>
        {model.featured && (
          <div className='mb-3 flex flex-wrap gap-2'>
            {model.capabilities?.map((capability) => (
              <span key={capability} className='rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-700'>
                {capability}
              </span>
            ))}
          </div>
        )}
        <p className='inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600'>
          {model.modelId}
        </p>
      </div>
    </div>
  );
};

const SupportedModelsSection = () => {
  return (
    <section className='border-t border-slate-100 bg-white py-24 px-6' id='supported-models'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-14 text-center'>
          <span className='mb-5 inline-block rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 shadow-sm'>
            Supported AI Models
          </span>
          <h2 className='mb-5 text-4xl font-black leading-tight tracking-[-0.03em] text-slate-900 sm:text-5xl'>
            Models running inside this app
          </h2>
          <p className='mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-500'>
            General Chat supports multiple open-source models, and document workflows are powered by Google Gemini.
          </p>
        </div>

        <div className='mb-10 flex items-center gap-2'>
          <MessagesSquare className='h-4.5 w-4.5 text-emerald-600' strokeWidth={2} />
          <h3 className='text-sm font-bold uppercase tracking-widest text-slate-500'>General Chat Models</h3>
        </div>

        <div className='mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {generalChatModels.map((model, index) => (
            <ModelCard key={model.name} model={model} delay={index * 90} />
          ))}
        </div>

        <div className='mb-5 flex items-center gap-2'>
          <Bot className='h-4.5 w-4.5 text-emerald-600' strokeWidth={2} />
          <h3 className='text-sm font-bold uppercase tracking-widest text-slate-500'>Document AI Model</h3>
        </div>

        <ModelCard model={documentAIModule} delay={0} />
      </div>
    </section>
  );
};

export default SupportedModelsSection;
