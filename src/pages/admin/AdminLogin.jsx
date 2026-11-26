import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";

export default function AdminLogin() {
  const { isAuthenticated, authLoading, login, enterDemoMode } = useAuth();
  const { refreshCatalog } = useCatalog();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectTo = location.state?.from || "/admin";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirectTo]);

  const handleOpenSampleMode = async () => {
    enterDemoMode(email.trim() || undefined);
    await refreshCatalog();
    toast.success("Opened Admin Panel in Sample UI Preview Mode.");
    navigate(redirectTo, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both your admin email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      if (res?.demo) {
        await refreshCatalog();
        toast.info("Backend not connected — opened Admin Panel in Sample Preview Mode.");
      } else {
        toast.success("Welcome back to GunLite Admin.");
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#14161A] font-['Inter'] flex flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B727C] hover:text-[#14161A] transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to GunLite Storefront</span>
          </Link>

          <div className="mx-auto flex justify-center mb-3">
            <img src="/images/logo.png" alt="GunLite" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#14161A] tracking-tight">
            Admin Console Login
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6B727C]">
            Sign in with your administrator credentials to manage products and categories.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E6E6E1] p-6 sm:p-8 shadow-[0_12px_32px_rgba(20,22,26,0.06)]">
          {errorMsg && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B97A8]" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full h-11 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] pl-10 pr-4 text-sm text-[#14161A] placeholder-[#8B97A8] focus:border-[var(--accent)] focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B97A8]" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] pl-10 pr-11 text-sm text-[#14161A] placeholder-[#8B97A8] focus:border-[var(--accent)] focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8B97A8] hover:text-[#14161A]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 mt-2"
            >
              {submitting ? "Signing in..." : "Sign In to Admin Panel"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#F1F1ED] space-y-3">
            <button
              type="button"
              onClick={handleOpenSampleMode}
              className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] hover:bg-[#F4F4F1] text-xs font-semibold text-[#14161A] inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Preview Admin UI (Sample Mode — No Backend)</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B727C]">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
              <span>Protected with HTTP-only JWT authentication</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
