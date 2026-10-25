import React from "react";
import { motion } from "framer-motion";
import { Tag, ShoppingBag, Star } from "lucide-react";
import Card from "./Card";

function Info({ data }) {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="relative overflow-hidden p-4 sm:p-6 md:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-500/10 blur-[50px]" />
        <motion.p
          {...fadeInUp}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
        >
          {data.subcategory}
        </motion.p>
        <motion.h2
          {...fadeInUp}
          className="mt-2 bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-black text-transparent dark:from-white dark:to-slate-400 sm:text-3xl md:text-4xl"
        >
          {data.name}
        </motion.h2>
        <motion.p
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
        >
          {data.description}
        </motion.p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Price", value: data.price, color: "text-emerald-500" },
          {
            label: "Discount",
            value: `${(
              ((data.price - data.discountPrice) / data.price) *
              100
            ).toFixed()}%`,
            color: "text-rose-500",
          },
          { label: "Stock", value: data.stock, color: "text-amber-500" },
          { label: "SKU", value: data.sku, color: "text-blue-500" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
              {stat.label}
            </p>
            <h3 className={`text-xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </h3>
          </Card>
        ))}
      </div>

      {/* Tags & Categories */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 font-bold text-sm mb-4">
            <Tag size={16} className="text-blue-500" />
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-linear-to-br from-blue-500/5 to-purple-500/5">
          <div className="flex items-center gap-2 font-bold text-sm mb-4">
            <ShoppingBag size={16} className="text-purple-500" />
            Category
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {data.category}
          </p>
        </Card>
      </div>

      {/* Highlights Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30"
      >
        <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
          <Star size={18} fill="currentColor" />
          Product Highlights
        </div>
        <p className="mt-3 text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
          Exclusively created by Apple Inc. featuring the next-generation neural
          engine and all-day battery life.
        </p>
      </motion.div>

      {/* CTA Button (Bonus Trick) */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 sm:py-4"
      >
        <ShoppingBag size={20} />
        Add to Cart
      </motion.button>
    </div>
  );
}

export default React.memo(Info);
