import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Eye, SlidersHorizontal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickEditContext } from "../../pages/ProductsPage";
import ImageCarousel from "./ImageCarousel";

function ProductCard({ product }) {
  const { setQuickEdit, deleteProduct } = useContext(QuickEditContext);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      {/* Image Carousel */}
      <ImageCarousel images={product.images} productName={product.name} />

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white capitalize">
            {product.name}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
            {product.category}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-end justify-between gap-3">
          <div className="text-slate-900 flex items-center gap-2 dark:text-white">
            <span className="text-3xl font-black">
              <sup className="text-sm font-semibold">EGP</sup>
              {product.discountPrice}
            </span>

            <span className="text-sm font-semibold text-gray-400 line-through">
              <sup className="text-xs font-normal">EGP</sup>
              {product.price}
            </span>
          </div>
          {product.discountPrice > 1 && (
            <span className="mb-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              −
              {(
                ((product.price - product.discountPrice) / product.price) *
                100
              ).toFixed()}
              % off
            </span>
          )}
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Link to={`/products/view/${product._id}`}>
            <button className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold text-slate-600 hover:text-cyan-600">
              <Eye size={13} /> View
            </button>
          </Link>
          <button
            onClick={() => {
              setQuickEdit(product._id, product.name);
            }}
            className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold text-slate-600 hover:text-amber-600"
          >
            <SlidersHorizontal size={13} /> Quick Edit
          </button>
          <button
            onClick={() => deleteProduct(product._id, product.name)}
            className="ml-auto flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-100"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default React.memo(ProductCard);
