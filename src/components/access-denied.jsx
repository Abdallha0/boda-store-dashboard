import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4 selection:bg-rose-500/20">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/10 bg-zinc-900/50 p-8 text-center backdrop-blur-md shadow-2xl shadow-rose-950/20">
        <div className="absolute -top-12 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-rose-500/15 blur-2xl" />

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/15 text-rose-400 shadow-[inset_0_0_12px_rgba(244,63,94,0.15)] animate-pulse">
          <Lock size={22} strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-zinc-100">
            Access Denied
          </h2>
          <p className="font-sans text-sm font-medium leading-relaxed text-rose-400/80">
            This section is restricted to administrators only.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700/50 px-4 py-2.5 text-xs font-semibold tracking-wide text-zinc-300 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
