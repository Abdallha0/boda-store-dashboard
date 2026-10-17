import React, { useCallback, useEffect, useReducer } from "react";
import CustomDropdown from "../products/customDropdown";
import { CheckCircle, Plus, X } from "lucide-react";
import { ProductsInitialDate } from "../../pages/addProductsPage";
import { categoriesArray } from "../../helpers/statices";

function reducer(state, action) {
  switch (action.type) {
    case "UPDATED_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "RESET":
      return { ...ProductsInitialDate, tags: [] };
    default:
      return state;
  }
}

function EnteredDataSec({ setProductData, onPublish, productData, isSaving, resetSignal }) {
  const getSavedProduct = JSON.parse(sessionStorage.getItem("productData"));
  const [product, dispatch] = useReducer(
    reducer,
    getSavedProduct || productData,
  );
  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    dispatch({ type: "RESET" });
  }, [resetSignal]);

  const handleChanges = useCallback((e) => {
    let value = e.target.value;
    if (typeof value === "string") {
      value = value.trimStart();
    }

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    dispatch({ type: "UPDATED_FIELD", field: e.target.name, value });
  }, []);

  useEffect(() => {
    setProductData(product);
    sessionStorage.setItem("productData", JSON.stringify(product));
  }, [product]);

  return (
    <section className="flex-1 rounded-2xl border border-slate-100 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-6">
        <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-2">
          Basic Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block col-span-2 md:col-span-1">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Product Name
            </span>
            <input
              name="name"
              value={product.name}
              onChange={handleChanges}
              placeholder="iPhone 16 Pro Max"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
          <label className="block col-span-2 md:col-span-1">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Short Description
            </span>
            <input
              name="shortDescription"
              value={product.shortDescription}
              onChange={handleChanges}
              placeholder="Key features in a few words"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
            Description
          </span>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChanges}
            rows="4"
            maxLength={1000}
            placeholder="Detailed breakdown of your product..."
            className="resize-none w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Price ($)
            </span>
            <input
              name="price"
              value={product.price}
              onChange={handleChanges}
              type="number"
              min={1}
              placeholder="999.00"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Discount Price ($)
            </span>
            <input
              type="number"
              onChange={handleChanges}
              name="discountPrice"
              value={product.discountPrice}
              placeholder="899.00 (Optional)"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Stock Quantity
            </span>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChanges}
              placeholder="150"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              SKU
            </span>
            <input
              name="sku"
              value={product.sku}
              onChange={handleChanges}
              placeholder="APL-PH-16-PM-BLK"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Category
            </span>

            <CustomDropdown
              showTitle={false}
              label={"Select Category"}
              onChange={handleChanges}
              value={product.category || "Select Category"}
              options={categoriesArray}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Subcategory
            </span>
            <input
              onChange={handleChanges}
              name="subcategory"
              value={product.subcategory}
              placeholder="e.g., Smartphones"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
            Brand
          </span>
          <input
            onChange={handleChanges}
            name="brand"
            value={product.brand}
            placeholder="Apple"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
          />
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Tags
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  !e.target.tags.value ||
                  product.tags.includes(e.target.tags.value)
                )
                  return;
                handleChanges({
                  target: {
                    name: "tags",
                    value: [...product.tags, e.target.tags.value],
                  },
                });
                e.target.tags.value = "";
              }}
              className="flex gap-3"
            >
              <input
                name="tags"
                placeholder="Add tag and press '+'"
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98]"
              >
                <Plus size={20} />
              </button>
            </form>
          </label>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {product.tags.map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-cyan-400/25 border dark:text-white border-cyan-400 px-3 py-1 text-xs font-medium text-slate-800"
              >
                {i}
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATED_FIELD",
                      field: "tags",
                      value: product.tags.filter((it) => it !== i),
                    })
                  }
                  type="button"
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-400"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <p className="text-xs text-slate-500 dark:text-slate-400 block w-full mt-1.5">
              Organize products with relevant tags.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 border-y border-slate-100 dark:border-slate-800 py-6 my-2">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
            <input
              name="featured"
              onChange={handleChanges}
              type="checkbox"
              value={product.featured}
              className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950"
            />
            Featured on Homepage
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
            <input
              name="isActive"
              onChange={handleChanges}
              value={product.isActive}
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950"
            />
            Set as Active
          </label>
        </div>

        <div className="flex flex-wrap gap-3.5 justify-end">
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold bg-slate-100 text-slate-950 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition active:scale-[0.98]"
            type="button"
          >
            Discard Draft
          </button>
          <button
            disabled={isSaving}
            onClick={onPublish}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold bg-cyan-600 text-white shadow-sm hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 transition active:scale-[0.98]"
            type="submit"
          >
            <CheckCircle size={18} />
            Publish Product
          </button>
        </div>
      </div>
    </section>
  );
}

export default EnteredDataSec;
