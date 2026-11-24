import React, { useState } from "react";
import { WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { pingConnection } from "../hooks/useOnlineStatus";

function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);
  const [showFailedMsg, setShowFailedMsg] = useState(false);

  const handleRefresh = async () => {
    setIsChecking(true);
    setShowFailedMsg(false);

    try {
      const isConnected = await pingConnection();
      if (isConnected) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("app:online"));
          window.location.reload();
        }
      } else {
        setIsChecking(false);
        setShowFailedMsg(true);
        setTimeout(() => setShowFailedMsg(false), 3500);
      }
    } catch {
      setIsChecking(false);
      setShowFailedMsg(true);
      setTimeout(() => setShowFailedMsg(false), 3500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-(--bg-primary) px-4">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-sky-500/10 flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-sky-400" strokeWidth={1.5} />
        </div>
        {/* pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-sky-400/30 animate-ping" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-(--text-primary) mb-2 tracking-tight">
        You&apos;re Offline
      </h1>

      {/* Description */}
      <p className="text-(--text-secondary) text-sm text-center max-w-xs mb-6 leading-relaxed">
        It looks like you lost your internet connection. Check your network
        settings and try again.
      </p>

      {/* Failed indicator message */}
      {showFailedMsg && (
        <div className="flex items-center gap-x-2 text-rose-400 text-xs mb-4 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg transition-all">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Still offline. Please reconnect your internet and try again.</span>
        </div>
      )}

      {/* Refresh button */}
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isChecking}
        className="flex items-center gap-x-2 px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 transition-all duration-150 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
        {isChecking ? "Checking Connection..." : "Try Again"}
      </button>
    </div>
  );
}

export default OfflinePage;
