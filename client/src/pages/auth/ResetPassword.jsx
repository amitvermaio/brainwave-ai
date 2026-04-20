import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncresetpassword } from "../../store/actions/authActions";
import { Brain, Lock, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const isLoading = status === "loading";
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const success = await dispatch(
      asyncresetpassword(token, { password: formData.password })
    );
    if (success) setDone(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-home flex flex-col items-center justify-center px-6 py-12">

      {/* Brand */}
      <div
        className="flex items-center gap-2.5 mb-12 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200">
          <Brain className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <span className="text-sm font-black text-slate-800 tracking-tight">BrainWave AI</span>
      </div>

      <div className="w-full max-w-sm fade-up">

        {!done ? (
          <>
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-[-0.03em] mb-1.5">
                Reset password
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Choose a strong new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-widest">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Min. 6 characters"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border-2 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all duration-200 font-home ${errors.password
                      ? "border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2} />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border-2 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all duration-200 font-home ${errors.confirmPassword
                      ? "border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-200 shimmer-btn mt-2"
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                  : <><ArrowRight className="w-4 h-4" strokeWidth={2.5} /> Update password</>
                }
              </button>
            </form>
          </>
        ) : (
          /* ── Success state ── */
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-[-0.03em] mb-2">
              Password updated!
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-200"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} /> Go to sign in
            </button>
          </div>
        )}

        {/* Back to login */}
        <button
          onClick={() => navigate("/login")}
          className="mt-8 flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to sign in
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;