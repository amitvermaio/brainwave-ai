import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
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
    const email = data.email.trim().toLowerCase();

    const result = await dispatch(asyncregisteruser({
      name: data.name,
      email,
      password: data.password,
    }));

    if (result?.success) {
      navigate('/verify-otp');
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>

      {/* CARD CONTAINER */}
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>

        {/* Logo */}
        <div className='flex items-center justify-center gap-2 mb-6'>
          <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center'>
            <Brain className='w-5 h-5 text-white' />
          </div>
          <span className='font-black text-lg'>BrainWave AI</span>
        </div>

        {/* Heading */}
        <h1 className='text-2xl font-black text-center mb-1'>Create your account</h1>
        <p className='text-center text-sm text-slate-500 mb-6'>Start your journey in seconds</p>

        {/* GOOGLE BUTTON */}
        <button
          type='button'
          className='w-full h-11 flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition mb-5'
        >
          <svg className='w-5 h-5' viewBox='0 0 24 24'>
            <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
            <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
            <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05'/>
            <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
          </svg>
          <span className='text-sm font-semibold'>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className='flex items-center gap-3 mb-5'>
          <div className='flex-1 h-px bg-slate-200' />
          <span className='text-xs text-slate-400'>OR</span>
          <div className='flex-1 h-px bg-slate-200' />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

          <InputField
            label='Full name'
            id='name'
            placeholder='Your name'
            error={errors.name}
            registration={register('name', { required: 'Name is required' })}
          >
            <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          </InputField>

          <InputField
            label='Email'
            id='email'
            type='email'
            placeholder='you@example.com'
            error={errors.email}
            registration={register('email', { required: 'Email is required' })}
          >
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
          </InputField>

          <InputField
            label='Password'
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            error={errors.password}
            registration={register('password', { required: 'Password required' })}
          >
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <button type='button' onClick={() => setShowPassword(p => !p)} className='absolute right-3 top-1/2 -translate-y-1/2'>
              {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </InputField>

          <InputField
            label='Confirm Password'
            id='confirmPassword'
            type={showConfirm ? 'text' : 'password'}
            placeholder='Confirm password'
            error={errors.confirmPassword}
            registration={register('confirmPassword', {
              validate: v => v === passwordValue || 'Passwords do not match'
            })}
          >
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
            <button type='button' onClick={() => setShowConfirm(p => !p)} className='absolute right-3 top-1/2 -translate-y-1/2'>
              {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </InputField>

          <button type='submit' disabled={isLoading} className='w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition'>
            {isLoading ? <Loader2 className='animate-spin mx-auto' /> : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className='mt-6 text-sm text-center text-slate-500'>
          Already have an account?{' '}
          <Link to='/login' className='text-emerald-600 font-semibold hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;