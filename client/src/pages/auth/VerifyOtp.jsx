import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Brain } from 'lucide-react';
import {
  asyncresendregistrationotp,
  asyncverifyregistrationotp,
} from '../../store/actions/authActions';

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, pendingVerificationEmail } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!pendingVerificationEmail) {
      navigate('/register');
    }
  }, [pendingVerificationEmail, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join('');
    if (finalOtp.length !== 6) return;

    const success = await dispatch(asyncverifyregistrationotp({ email: pendingVerificationEmail, otp: finalOtp }));

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleResend = async () => {
    await dispatch(asyncresendregistrationotp({ email: pendingVerificationEmail }));
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>

      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>

        {/* Logo */}
        <div className='flex items-center justify-center gap-2 mb-6'>
          <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center'>
            <Brain className='w-5 h-5 text-white' />
          </div>
          <span className='font-black text-lg'>BrainWave AI</span>
        </div>

        {/* Heading */}
        <h1 className='text-2xl font-black text-center mb-1'>Verify OTP</h1>
        <p className='text-center text-sm text-slate-500'>
          Enter the 6-digit code sent to
        </p>
        <p className='text-center text-sm font-semibold text-emerald-600 break-all mb-6'>
          {pendingVerificationEmail}
        </p>

        {/* OTP INPUT */}
        <form onSubmit={handleSubmit}>
          <div className='flex justify-between gap-2 mb-6'>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type='text'
                inputMode='numeric'
                maxLength='1'
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className='w-12 h-12 text-center text-lg font-bold rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition'
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full h-12 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200'
          >
            {isLoading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        {/* Resend */}
        <p className='text-center text-sm text-slate-500 mt-6'>
          Didn’t receive code?{' '}
          <button
            type='button'
            onClick={handleResend}
            disabled={isLoading}
            className='text-emerald-600 font-bold hover:underline disabled:text-slate-400'
          >
            Resend
          </button>
        </p>

        {/* Back */}
        <p className='text-center text-sm text-slate-500 mt-4'>
          Wrong email?{' '}
          <Link to='/register' className='text-emerald-600 font-bold hover:underline'>
            Register again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;