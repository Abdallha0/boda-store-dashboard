import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, m } from "framer-motion";
import { ChevronDown, Check, Plus } from "lucide-react";

function CustomSelect({
  label,
  options,
  value,
  onChange,
  showTitle = true,
  additionBar = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [categories, setCategory] = useState(options);
  const [newCat, setNewCat] = useState("");
  return (
    <div className="relative space-y-1.5 w-full capitalize" ref={dropdownRef}>
      {showTitle && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide select-none">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-left text-xs font-medium text-slate-700 outline-none transition-all duration-200 hover:bg-slate-100/70 focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 dark:focus:border-cyan-500/60"
      >
        <span className="truncate">{value}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 dark:text-slate-500"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* Options Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50 outline-none dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            {categories.map((option) => {
              const isSelected = option.toLowerCase() === value.toLowerCase();
              return (
                <li key={option} title={option}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        target: {
                          name: "category",
                          value: option,
                        },
                      });
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className="truncate capitalize">{option}</span>
                    {isSelected && (
                      <Check size={12} className="text-cyan-500 shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
            {additionBar && (
              <>
                <hr className="opacity-10" />
                <div className="p-2 flex items-center justify-center gap-2 max-w-full">
                  <input
                    type="text"
                    name="box"
                    onChange={(e) => setNewCat(e.target.value)}
                    value={newCat}
                    placeholder="Add Category"
                    className="h-8 flex w-[95%] text-xs tracking-wide font-semibold flex-1 rounded-lg border border-slate-200 bg-white px-1 text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-.3 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
                  />
                  <button
                  type="button"
                    onClick={() => {
                      const value = newCat.trim();
                      if (!value || categories.includes(value)) return;
                      setCategory((prev) => [...prev, value]);
                    }}
                    className="inline-flex h-8 p-1 w-8 items-center justify-center rounded-lg text-white bg-slate-900 shadow-sm transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98]"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(CustomSelect);
