import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import CustomSelect from "./customDropdown";
import { sortArray } from "../../helpers/statices";
import { useSearchParams } from "react-router-dom";

function ProductsSearchForm({ setFilterParameters, categories }) {
  const categoriesArray = [
    "Select Category",
    ...categories?.map((i) => i.name),
  ];
  const [parameters, setParameters] = useSearchParams("");
  const [searchQuery, setSearchQuery] = useState(
    parameters.get("search") || "",
  );
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(parameters.get("sort") || "Most Recent");
  const [category, setCategory] = useState(
    parameters.get("category") || categoriesArray[0],
  );
  const [subcategory, setSubcategory] = useState(
    parameters.get("subcategory") || "",
  );

  useEffect(() => {
    const nextParams = new URLSearchParams(parameters);

    const obj = {
      search: searchQuery,
      sort: sortBy,
      category: category,
      subcategory: subcategory,
    };

    if (category === categoriesArray[0]) {
      nextParams.delete("category");
      delete obj.category;
    }
    if (sortBy === sortArray[0]) {
      nextParams.delete("sort");
      delete obj.sort;
    }

    for (const key in obj) {
      if (obj[key]) {
        nextParams.set(key, obj[key]);
      } else {
        nextParams.delete(key);
      }
    }

    setParameters(nextParams);
  }, [category, sortBy, subcategory, searchQuery]);

  function cancel() {
    setFilterParameters("");
    setParameters({});
    setSearchQuery("");
    setShowFilters(false);
    setSortBy(sortArray[0]);
    setCategory(categoriesArray[0]);
    setSubcategory("");
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-12 flex-1 sm:flex-initial sm:py-4 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-300 ${
              showFilters
                ? "border-cyan-200 bg-cyan-50/50 text-cyan-600 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-400"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <motion.div
              animate={{ rotate: showFilters ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <SlidersHorizontal size={15} />
            </motion.div>
            Filters
          </motion.button>
          {/* Main Input Field */}
          <div className="relative flex-1">
            <motion.div
              initial={false}
              animate={{
                scale: isFocused ? 1.015 : 1,
                opacity: isFocused ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-md pointer-events-none"
            />

            <Search
              size={16}
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                isFocused
                  ? "text-cyan-500"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />

            <input
              type="text"
              placeholder="Search products…"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-cyan-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-cyan-500/60 dark:focus:bg-slate-900"
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Action Call To Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={cancel}
              className={`flex h-12 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-300 ${
                showFilters
                  ? "border-cyan-200 bg-cyan-50/50 text-cyan-600 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-400"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.03,
                y: -1,
                boxShadow: "0 4px 12px rgba(6, 182, 212, 0.25)",
              }}
              onClick={() =>
                setFilterParameters(new URLSearchParams(parameters).toString())
              }
              whileTap={{ scale: 0.97 }}
              className="flex h-12 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 text-sm font-bold text-white transition-colors hover:bg-cyan-400"
            >
              <Search size={15} strokeWidth={2.5} />
              Search
            </motion.button>
          </div>
        </div>

        {/* Custom Dropdown Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ type: "spring", duration: 0.38, bounce: 0 }}
              className="border-t border-slate-100 dark:border-slate-800/60 pt-4"
            >
              <div className="grid items-center grid-cols-1 md:grid-cols-3 gap-4">
                <CustomSelect
                  label="Sort By"
                  options={sortArray}
                  value={sortBy}
                  additionBar={false}
                  onChange={(event) => setSortBy(event.target.value)}
                />

                <CustomSelect
                  label="Category"
                  options={categoriesArray}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />

                <form action="h-10">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide select-none">
                    Subcategory
                  </label>
                  <input
                    placeholder="e.g. smartphones"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-600"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default React.memo(ProductsSearchForm);
