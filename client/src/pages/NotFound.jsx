import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-slate-50 font-home flex flex-col items-center justify-center px-6 text-center'>
      <p className='text-8xl font-black text-emerald-500 tracking-tight leading-none'>404</p>
      <h1 className='text-2xl font-black text-slate-900 tracking-tight mt-4 mb-2'>Page not found</h1>
      <p className='text-sm text-slate-400 font-medium max-w-xs'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate(-1)}
        className='mt-8 flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-sm font-bold rounded-xl transition-all duration-200 active:scale-95'
      >
        <ArrowLeft className='w-4 h-4' strokeWidth={2.5} />
        Go back
      </button>
    </div>
  );
};

export default NotFound;