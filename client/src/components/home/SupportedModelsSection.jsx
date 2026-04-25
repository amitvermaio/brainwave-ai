import { useEffect, useRef, useState } from 'react';
import { Bot, MessagesSquare } from 'lucide-react';

const defaultGeneralChatModels = [
  {
    type: 'normal',
    name: 'Nemotron 3 Super 120B',
    provider: 'NVIDIA',
    useCase: 'Balanced quality for everyday questions in General Chat',
    modelId: 'nvidia/nemotron-3-super-120b-a12b:free',
    logo: '/nvidia-color.svg',
  },
  {
    type: 'fast',
    name: 'GPT-OSS 120B',
    provider: 'OpenAI',
    useCase: 'Lower-latency replies for quick prompts in General Chat',
    modelId: 'openai/gpt-oss-120b:free',
    logo: '/openai.svg',
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

const getLogoPlateClass = (model) => {
  if (model.type === 'normal' || model.provider === 'NVIDIA') {
    return 'bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.35),transparent_58%),radial-gradient(circle_at_80%_85%,rgba(20,184,166,0.28),transparent_62%),linear-gradient(135deg,rgba(236,253,245,1)_0%,rgba(240,253,250,1)_100%)] ring-emerald-200/80';
  }

  if (model.type === 'fast' || model.provider === 'OpenAI') {
    return 'bg-[radial-gradient(circle_at_30%_18%,rgba(56,189,248,0.35),transparent_56%),radial-gradient(circle_at_78%_82%,rgba(34,211,238,0.28),transparent_60%),linear-gradient(135deg,rgba(239,246,255,1)_0%,rgba(236,254,255,1)_100%)] ring-sky-200/80';
  }

  if (model.featured) {
    return 'bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.30),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(45,212,191,0.25),transparent_60%),linear-gradient(135deg,rgba(240,253,250,1)_0%,rgba(240,249,255,1)_100%)] ring-teal-200/80';
  }

  return 'bg-slate-50 ring-slate-200';
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
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${getLogoPlateClass(model)}`}>
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
        {model.type && (
          <p className='mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700'>
            Model Type: {model.type}
          </p>
        )}
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

const SupportedModelsSection = ({ generalChatModels = defaultGeneralChatModels }) => {
  const hasTwoModels = generalChatModels.length === 2;

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
            General Chat currently supports Normal and Fast model modes, and document workflows are powered by Google Gemini.
          </p>
        </div>

        <div className='mb-10 flex items-center gap-2'>
          <MessagesSquare className='h-4.5 w-4.5 text-emerald-600' strokeWidth={2} />
          <h3 className='text-sm font-bold uppercase tracking-widest text-slate-500'>General Chat Models</h3>
        </div>

        <div className={`mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 ${hasTwoModels ? 'mx-auto max-w-4xl lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {generalChatModels.map((model, index) => (
            <ModelCard key={model.name} model={model} delay={index * 90} />
          ))}
        </div>

        <div className='mb-5 flex items-center gap-2'>
          <Bot className='h-4.5 w-4.5 text-emerald-600' strokeWidth={2} />
          <h3 className='text-sm font-bold uppercase tracking-widest text-slate-500'>Document AI Model Type</h3>
        </div>

        <div className='mx-auto w-full max-w-4xl'>
          <ModelCard model={documentAIModule} delay={0} />
        </div>
      </div>
    </section>
  );
};

export default SupportedModelsSection;
