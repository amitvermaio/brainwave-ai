import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, User, ArrowRight, Sparkles } from 'lucide-react';
import { asyncregisteruser } from '../../store/actions/authActions';

const InputField = ({ label, id, type = 'text', placeholder, registration, error, children }) => (
  <div className='space-y-1.5'>
    <label htmlFor={id} className='block text-xs font-bold text-slate-600 uppercase tracking-widest'>
      {label}
    </label>
    <div className='relative'>
      {children}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border-2 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all duration-200 font-home ${
          error
            ? 'border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
        }`}
      />
    </div>
    {error && <p className='text-xs font-semibold text-red-500 mt-1'>{error.message}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.auth);
  const isLoading = status === 'loading';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    const result = await dispatch(asyncregisteruser({
      name: data.name,
      email: data.email,
      password: data.password,
    }));
    if (result?.success) {
      navigate(`/verify-otp?email=${encodeURIComponent(result.email)}`);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 font-home flex'>

      {/* ── Left panel — form ── */}
      <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>

        {/* Mobile logo */}
        <div className='flex lg:hidden items-center gap-2.5 mb-10'>
          <div className='w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200'>
            <Brain className='w-4 h-4 text-white' strokeWidth={2} />
          </div>
          <span className='text-sm font-black text-slate-800 tracking-tight'>BrainWave AI</span>
        </div>

        <div className='w-full max-w-sm fade-up'>
          {/* Heading */}
          <div className='mb-8'>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full mb-4'>
              <Sparkles className='w-3 h-3 text-emerald-500' strokeWidth={2.5} />
              <span className='text-[11px] font-bold text-emerald-600 uppercase tracking-widest'>Free forever</span>
            </div>
            <h1 className='text-3xl font-black text-slate-900 tracking-[-0.03em] mb-1.5'>Create your account</h1>
            <p className='text-sm text-slate-500 font-medium'>Start learning smarter in seconds</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name */}
            <InputField
              label='Full name'
              id='name'
              placeholder='Your name'
              error={errors.name}
              registration={register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            >
              <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
            </InputField>

            {/* Email */}
            <InputField
              label='Email'
              id='email'
              type='email'
              placeholder='you@example.com'
              error={errors.email}
              registration={register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            >
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
            </InputField>

            {/* Password */}
            <InputField
              label='Password'
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Min. 6 characters'
              error={errors.password}
              registration={register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            >
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
              <button
                type='button'
                onClick={() => setShowPassword(p => !p)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
              >
                {showPassword ? <EyeOff className='w-4 h-4' strokeWidth={2} /> : <Eye className='w-4 h-4' strokeWidth={2} />}
              </button>
            </InputField>

            {/* Confirm password */}
            <InputField
              label='Confirm password'
              id='confirmPassword'
              type={showConfirm ? 'text' : 'password'}
              placeholder='Re-enter your password'
              error={errors.confirmPassword}
              registration={register('confirmPassword', {
                required: 'Please confirm your password',
                validate: v => v === passwordValue || 'Passwords do not match',
              })}
            >
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' strokeWidth={2} />
              <button
                type='button'
                onClick={() => setShowConfirm(p => !p)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
              >
                {showConfirm ? <EyeOff className='w-4 h-4' strokeWidth={2} /> : <Eye className='w-4 h-4' strokeWidth={2} />}
              </button>
            </InputField>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full h-12 flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-200 shimmer-btn mt-2'
            >
              {isLoading
                ? <><Loader2 className='w-4 h-4 animate-spin' /> Creating account...</>
                : <><ArrowRight className='w-4 h-4' strokeWidth={2.5} /> Create account</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-slate-200' />
            <span className='text-xs font-semibold text-slate-400 uppercase tracking-widest'>or</span>
            <div className='flex-1 h-px bg-slate-200' />
          </div>

          {/* Google OAuth */}
          <button
            type='button'
            onClick={() => navigate('/auth/google')}
            className='w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98]'
          >
            <svg className='w-4 h-4 shrink-0' viewBox='0 0 24 24'>
              <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
              <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
              <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05' />
              <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
            </svg>
            Continue with Google
          </button>

          {/* Sign in link */}
          <p className='text-center text-sm text-slate-500 font-medium mt-8'>
            Already have an account?{' '}
            <Link to='/login' className='font-bold text-emerald-600 hover:text-emerald-700 transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right panel — decorative ── */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col items-center justify-center p-16'>
        <div className='absolute inset-0 dot-grid opacity-20' />
        <div className='absolute top-1/4 right-1/3 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl orb-float pointer-events-none' />
        <div className='absolute bottom-1/4 left-1/4 w-56 h-56 bg-teal-500/20 rounded-full blur-3xl orb-float-delayed pointer-events-none' />

        <div className='relative z-10 max-w-sm text-center'>
          {/* Logo */}
          <div className='inline-flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-900/50'>
              <Brain className='w-5 h-5 text-white' strokeWidth={2} />
            </div>
            <span className='text-base font-black text-white tracking-tight'>BrainWave AI</span>
          </div>
          <p className='text-slate-400 text-sm font-medium mb-10'>AI-powered document intelligence</p>

          {/* Big quote */}
          <div className='bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left'>
            <p className='text-white text-sm font-medium leading-relaxed italic'>
              "Upload any PDF and instantly get summaries, flashcards, quizzes and a chat interface — all grounded in your actual document content via a full RAG pipeline."
            </p>
          </div>

          {/* Stats row */}
          <div className='grid grid-cols-3 gap-4'>
            {[
              { v: '4', l: 'AI modules' },
              { v: 'RAG', l: 'Pipeline' },
              { v: '∞', l: 'Documents' },
            ].map(s => (
              <div key={s.l} className='bg-white/5 border border-white/10 rounded-xl p-3'>
                <p className='text-xl font-black text-emerald-400'>{s.v}</p>
                <p className='text-[11px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5'>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;