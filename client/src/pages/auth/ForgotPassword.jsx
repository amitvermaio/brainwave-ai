import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BrainCircuit, Mail, ArrowRight, Sparkles, ShieldCheck, Send } from 'lucide-react';
import { asyncforgotpassword } from '../../store/actions/authActions';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (formData) => {
    const success = await dispatch(
      asyncforgotpassword({
        email: formData.email,
      }),
    );

    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-5 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 -top-24 h-88 w-88 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(148,163,184,0.12)_1px,transparent_0)] bg-size-[24px_24px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/70 shadow-[0_25px_80px_-20px_rgba(6,182,212,0.3)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden border-r border-slate-700/70 bg-linear-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-10 lg:block">
          <div className="flex items-center gap-3 text-white">
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/15 p-2.5">
              <BrainCircuit className="h-5 w-5 text-cyan-300" strokeWidth={2.4} />
            </div>
            <span className="text-lg font-semibold tracking-wide">NeuroPrep AI</span>
          </div>

          <div className="mt-16 space-y-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Account Recovery
            </p>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight text-slate-100">
              Reset quickly and get back to focused learning.
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-slate-300/95">
              We will send password reset instructions to your registered email address.
            </p>
          </div>

          <div className="mt-14 grid gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/70 p-4 text-slate-200">
              <Send className="h-4.5 w-4.5 text-cyan-300" />
              <span className="text-sm">Secure reset link delivery</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/70 p-4 text-slate-200">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-300" />
              <span className="text-sm">Token-based password recovery</span>
            </div>
          </div>
        </section>

        <section className="p-5 sm:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 lg:mx-0">
                <BrainCircuit className="h-6 w-6 text-cyan-300" strokeWidth={2.2} />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-100">Forgot password</h1>
              <p className="mt-2 text-sm text-slate-300/90">Enter your email and we will send a reset link.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-cyan-300" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-slate-800/75 py-2.5 pl-10 pr-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/20 ${errors.email ? 'border-red-400/70' : 'border-slate-700/80'}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-300">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(6,182,212,0.85)] transition hover:from-cyan-400 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'loading' ? 'Sending link...' : 'Send reset link'}
                <ArrowRight className="h-4.5 w-4.5 transition group-hover:translate-x-0.5" />
              </button>

              <p className="text-center text-sm text-slate-300 lg:text-left">
                Remembered your password?{' '}
                <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                  Back to sign in
                </Link>
              </p>
            </form>

            <div className="mt-5 rounded-xl border border-slate-700/70 bg-slate-800/65 p-3.5 text-xs leading-relaxed text-slate-300/95">
              For security, we always show the same response even if the email is not registered.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForgotPassword;