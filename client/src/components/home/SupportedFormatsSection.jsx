import { useRef, useEffect, useState } from 'react';
import { FileText, MonitorPlay, AlertTriangle } from 'lucide-react';

const formats = [
  {
    icon: FileText,
    name: 'PDF',
    description: 'Portable Document Format. Must have a selectable text layer — not a scanned image.',
    extensions: ['.pdf'],
    color: 'red',
  },
  {
    icon: FileText,
    name: 'Word Document',
    description: 'Microsoft Word files in both legacy and modern formats.',
    extensions: ['.doc', '.docx'],
    color: 'blue',
  },
  {
    icon: MonitorPlay,
    name: 'PowerPoint',
    description: 'Presentation slides. All text content across slides is extracted and processed.',
    extensions: ['.ppt', '.pptx'],
    color: 'amber',
  },
];

const colorMap = {
  red: { bg: 'bg-red-50', icon: 'text-red-500', badge: 'bg-red-50 text-red-700 border border-red-200' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', badge: 'bg-blue-50 text-blue-700 border border-blue-200' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-500', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
};

const FormatCard = ({ icon: Icon, name, description, extensions, color, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const c = colorMap[color];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className='group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg h-full flex flex-col gap-4'>
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={2} />
        </div>
        <div className='flex-1'>
          <h3 className='text-base font-bold text-slate-900 mb-1.5'>{name}</h3>
          <p className='text-sm text-slate-500 leading-relaxed'>{description}</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {extensions.map((ext) => (
            <span key={ext} className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${c.badge}`}>
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const SupportedFormatsSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className='py-28 px-6 bg-white border-t border-slate-100' id='supported-formats'>
      <div className='max-w-5xl mx-auto'>

        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className='inline-block px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-bold rounded-full uppercase tracking-widest mb-5 shadow-sm'>
            Supported formats
          </span>
          <h2 className='text-4xl sm:text-5xl font-black text-slate-900 tracking-[-0.03em] leading-tight mb-5'>
            What you can{' '}
            <span className='hero-gradient-text'>upload</span>
          </h2>
          <p className='text-slate-500 text-base leading-relaxed font-medium max-w-xl mx-auto'>
            BrainWave AI works with the most common document formats. As long as your file has real text — not scanned images — we can process it.
          </p>
        </div>

        {/* Format cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10'>
          {formats.map((fmt, i) => (
            <FormatCard key={fmt.name} {...fmt} index={i} />
          ))}
        </div>

        {/* Scanned doc warning */}
        <div className='flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-6'>
          <div className='w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0'>
            <AlertTriangle className='w-5 h-5 text-amber-600' strokeWidth={2} />
          </div>
          <div>
            <h4 className='text-sm font-bold text-amber-900 mb-1'>
              Scanned documents won't work
            </h4>
            <p className='text-sm text-amber-700 leading-relaxed'>
              If your file is a photo or a scanned image saved as a PDF — where you can't highlight or select any text — the AI has no text to extract and will fail to process it. Make sure your document has an actual text layer before uploading.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SupportedFormatsSection;