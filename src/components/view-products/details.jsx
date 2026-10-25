import React from "react";
import GallerySec from "./gallerySec";
import Info from "./Info";

function ProductDetailView({ product }) {
  const infoObject = {
    name: product.name,
    price: product.price,
    category: product.category,
    brand: product.brand,
    stock: product.stock,
    description: product.description,
    rating: product.rating,
    createdAt: product.createdAt,
    discountPrice: product.discountPrice,
    sku: product.sku,
    tags: product.tags,
    reviews: product.reviews,
    subcategory: product.subcategory
  };
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
        {/* LEFT COLUMN: GALLERY */}
        <GallerySec images={product.images} />

        {/* RIGHT COLUMN: INFO */}
        <Info data={infoObject} />
      </div>
    </div>
  );
}

export default React.memo(ProductDetailView);
