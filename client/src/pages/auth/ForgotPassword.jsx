import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Brain, Mail, ArrowLeft, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { asyncforgotpassword } from '../../store/actions/authActions';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const isLoading = status === 'loading';
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    const success = await dispatch(asyncforgotpassword({ email: data.email }));
    if (success) {
      setSentEmail(data.email);
      setSent(true);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 font-home flex flex-col items-center justify-center px-6 py-12'>

      {/* Brand */}
      <div
        className='flex items-center gap-2.5 mb-12 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200'>
          <Brain className='w-4 h-4 text-white' strokeWidth={2} />
        </div>
        <span className='text-sm font-black text-slate-800 tracking-tight'>BrainWave AI</span>
      </div>

      <div className='w-full max-w-sm fade-up'>

        {!sent ? (
          <>
            {/* Heading */}
            <div className='mb-8'>
              <h1 className='text-3xl font-black text-slate-900 tracking-[-0.03em] mb-1.5'>
                Forgot password?
              </h1>
              <p className='text-sm text-slate-500 font-medium'>
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Email */}
              <div className='space-y-1.5'>
                <label htmlFor='email' className='block text-xs font-bold text-slate-600 uppercase tracking-widest'>
                  Email
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
                  <input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                    })}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border-2 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all duration-200 font-home ${
                      errors.email
                        ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className='text-xs font-semibold text-red-500 mt-1'>{errors.email.message}</p>
                )}
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-200 shimmer-btn mt-2'
              >
                {isLoading
                  ? <><Loader2 className='w-4 h-4 animate-spin' /> Sending...</>
                  : <><ArrowRight className='w-4 h-4' strokeWidth={2.5} /> Send reset link</>
                }
              </button>
            </form>
          </>
        ) : (
          /* ── Success state ── */
          <div className='text-center'>
            <div className='w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-6'>
              <CheckCircle2 className='w-7 h-7 text-emerald-500' strokeWidth={1.5} />
            </div>
            <h1 className='text-2xl font-black text-slate-900 tracking-[-0.03em] mb-2'>Check your inbox</h1>
            <p className='text-sm text-slate-500 font-medium leading-relaxed'>
              If <span className='font-bold text-slate-700'>{sentEmail}</span> is registered, a reset link is on its way. Check your spam folder too.
            </p>
            <button
              onClick={() => setSent(false)}
              className='mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2'
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Back to login */}
        <button
          onClick={() => navigate('/login')}
          className='mt-8 flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors mx-auto'
        >
          <ArrowLeft className='w-4 h-4' strokeWidth={2.5} />
          Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;