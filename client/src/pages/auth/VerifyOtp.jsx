import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
  asyncresendregistrationotp,
  asyncverifyregistrationotp,
} from '../../store/actions/authActions';

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { status, pendingVerificationEmail } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const email =
    searchParams.get('email') ||
    pendingVerificationEmail ||
    localStorage.getItem('pendingVerificationEmail') ||
    '';

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextOtp = pasted.split('');
    while (nextOtp.length < 6) {
      nextOtp.push('');
    }

    setOtp(nextOtp);
    const lastIndex = Math.min(pasted.length, 6) - 1;
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const finalOtp = otp.join('');
    if (!email || finalOtp.length !== 6) {
      return;
    }

    const success = await dispatch(asyncverifyregistrationotp({ email, otp: finalOtp }));
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    await dispatch(asyncresendregistrationotp({ email }));
  };

  return (
    <div className='min-h-screen bg-slate-50 font-home flex'>
      <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-black text-slate-900 tracking-tight mb-2'>
              Verify OTP
            </h1>
            <p className='text-sm text-slate-500 font-medium'>
              Enter the 6-digit code sent to your email
            </p>
            <p className='text-xs font-semibold text-emerald-600 mt-2 break-all'>
              {email || 'No email selected'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='flex justify-between gap-2 mb-6' onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type='text'
                  inputMode='numeric'
                  maxLength='1'
                  value={digit}
                  onChange={(event) => handleChange(event.target.value, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className='w-12 h-12 text-center text-lg rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition'
                />
              ))}
            </div>

            <button
              type='submit'
              disabled={isLoading || !email}
              className='w-full h-12 flex items-center justify-center bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200'
            >
              {isLoading ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          <p className='text-center text-sm text-slate-500 font-medium mt-6'>
            Did not receive code?{' '}
            <button
              type='button'
              onClick={handleResend}
              disabled={isLoading || !email}
              className='text-emerald-600 font-bold cursor-pointer hover:underline disabled:text-slate-400 disabled:no-underline'
            >
              Resend
            </button>
          </p>

          <p className='text-center text-sm text-slate-500 font-medium mt-4'>
            Wrong email?{' '}
            <Link to='/register' className='text-emerald-600 font-bold hover:underline'>
              Register again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;