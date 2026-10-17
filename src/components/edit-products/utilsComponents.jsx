import React, { useEffect, useState } from "react";

const FormField = ({ label, children, required }) => (
  <div className="flex flex-col gap-2">
    <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = (props) => {
  const [q, setQ] = useState("");
  useEffect(() => {
    if (typeof props.value === "number" || props.value) {
      setQ(props.value);
    }
  }, [props]);

  return (
    <input
      onChange={(e) => {
        setQ(e.target.value);
        props.setChanges((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }}
      {...props}
      value={q}
      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-600 dark:focus:border-cyan-500"
    />
  );
};

export { Input, FormField };
