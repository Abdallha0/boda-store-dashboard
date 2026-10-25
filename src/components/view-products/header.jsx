import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";
import { Link } from "react-router-dom";

function ProductHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-slate-50/50 to-slate-100 p-6 sm:p-8 shadow-xl transition-colors duration-300 dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-2xl"
    >
      <Link to="/products">
        <motion.button
          whileHover={{ x: -4 }}
          className="group mb-6 flex items-center gap-2 text-sm font-semibold transition-colors
                   text-slate-500 hover:text-slate-900 
                   dark:text-slate-400 dark:hover:text-white px-5 py-1 rounded-full border border-slate-300/20"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Products
        </motion.button>
      </Link>
      <div className="flex items-center gap-5">
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all
                        bg-slate-100 border border-slate-200 
                        dark:bg-white/5 dark:border-white/10 shadow-inner"
        >
          <Eye size={28} className="text-blue-600 dark:text-blue-400" />

          {/* Subtle Pulse effect (Hidden in Light mode for a cleaner look, active in Dark) */}
          <span className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl animate-pulse hidden dark:block" />
        </div>

        <div className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight 
                       text-slate-900
                       dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b dark:from-white dark:to-slate-400"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] 
                          text-slate-400 dark:text-slate-500"
              >
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(ProductHeader);
