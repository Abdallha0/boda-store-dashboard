import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Trash2,
  Power,
  Star,
  Package,
  Layers,
  ImagePlus,
  LoaderCircle,
  StarOff,
  PowerOff,
  X,
  Plus,
} from "lucide-react";
import { Input, FormField } from "./utilsComponents";
import CustomDropdown from "../products/customDropdown";
import { categoriesArray } from "../../helpers/statices";
import { updateProduct } from "../../services/products-api";
import { toast } from "react-toastify";
import { toastStyles } from "../../helpers/tones";
import FieldsFormSkeleton from "./fieldsFormSkeleton";

function FieldsFormComponent({
  product = {},
  submitRef,
  discardRef,
  setIsSaving,
  refetchProduct,
}) {
  const [category, setCategory] = useState({
    target: {
      name: "category",
      value: product?.category,
    },
  });

  const [isFeatured, setIsFeatured] = useState(product?.featured);
  const [isActive, setIsActive] = useState(product?.isActive);
  const [images, setImages] = useState(product?.images ?? []);
  const [deletedImages, setDeletedImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [formKey, setFormKey] = useState(0);

  const [changes, setChanges] = useState(null);

  useEffect(() => {
    setTags(product?.tags);
    setImages(product?.images ?? []);
    setIsFeatured(Boolean(product?.featured));
    setIsActive(Boolean(product?.isActive));
    setCategory({
      target: {
        name: "category",
        value: product?.category || "",
      },
    });
  }, [product]);
  const [files, setFiles] = useState([]);
  const handleAddImages = useCallback(
    (e) => {
      const file = e.target.files[0];
      setFiles((prev) => [...prev, file]);
      const url = URL.createObjectURL(file);
      setImages([...images, { public_id: file.name, url }]);
    },
    [images],
  );

  const handleDeleteImage = (image) => {
    setFiles(files.filter((i) => i.name !== image.public_id));
    setImages(images.filter((i) => i.public_id !== image.public_id));
    setDeletedImages([...deletedImages, image]);
  };

  function submitChanges() {
    if (
      !files.length &&
      !deletedImages.length &&
      !Object.keys(changes).length
    ) {
      toast.info("No changes to save.", { style: toastStyles.info });
      return;
    }

    const payload = new FormData();
    Object.entries(changes).forEach(([k, v]) => payload.append(k, v));
    files.forEach((file) => payload.append("images", file));
    if (deletedImages.length)
      payload.append(
        "deletedImages",
        JSON.stringify(deletedImages.map((i) => i.public_id)),
      );

    setIsSaving(true);
    updateProduct(product._id, payload)
      .then((res) => {
        if (res.success) {
          toast.success(res.message || "Product updated successfully!", {
            style: toastStyles.success,
          });
          // Clear transient state after successful save
          setFiles([]);
          setDeletedImages([]);
          // Refetch fresh product data so the form reflects the saved state
          refetchProduct();
        } else {
          toast.error(res.message || "Failed to update product.", {
            style: toastStyles.error,
          });
        }
      })
      .catch((e) => {
        toast.error(e.message || "Failed! unexpected error", {
          style: toastStyles.error,
        });
      })
      .finally(() => setIsSaving(false));
  }

  function discardChanges() {
    // Reset all local state back to the original product prop values
    setChanges(null);
    setImages(product.images ?? []);
    setIsFeatured(Boolean(product.featured));
    setIsActive(Boolean(product.isActive));
    setCategory({
      target: {
        name: "category",
        value: product.category || "",
      },
    });
    // Clear any staged file uploads and deletions
    setFiles([]);
    setDeletedImages([]);
    // Force Input components to re-mount and pick up fresh product values
    setFormKey((k) => k + 1);
  }
  const imageInput = useRef(null);
  const tagsQueryRef = useRef("");
  return (
    <form
      key={formKey}
      action={submitChanges}
      id="quick-edit-product-form"
      className="flex-1 space-y-6 overflow-y-auto px-6 py-5 sm:px-8"
    >
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Product Name" required>
              <Input
                setChanges={setChanges}
                name="name"
                placeholder={product.name}
              />
            </FormField>

            <FormField label="SKU" required>
              <Input
                setChanges={setChanges}
                name="sku"
                placeholder={product.sku}
              />
            </FormField>
          </div>

          <FormField label="Short Description">
            {product.shortDescription ? (
              <textarea
                onChange={(e) =>
                  setChanges((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder={product.shortDescription || ""}
                rows={3}
                name="shortDescription"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            ) : (
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
                <div className="flex flex-row size-full items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:.4s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:.6s]" />
                </div>
              </div>
            )}
          </FormField>

          <FormField label="description">
            {product.description ? (
              <textarea
                onChange={(e) =>
                  setChanges((prev) => ({
                    ...prev,
                    descriptions: e.target.value,
                  }))
                }
                placeholder={product.description || ""}
                name="description"
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
              />
            ) : (
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
                <div className="flex flex-row size-full items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:.4s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-bounce [animation-delay:.6s]" />
                </div>
              </div>
            )}
          </FormField>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Price">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  $
                </span>
                <Input
                  setChanges={setChanges}
                  name="price"
                  placeholder={product.price}
                  className="pl-8"
                />
              </div>
            </FormField>

            <FormField label="Discount Price">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  $
                </span>
                <Input
                  setChanges={setChanges}
                  placeholder={product.discountPrice}
                  name="discountPrice"
                  className="pl-8"
                />
              </div>
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Stock">
              <Input
                setChanges={setChanges}
                name="stock"
                placeholder={product.stock}
              />
            </FormField>

            <FormField label="Brand">
              <Input
                setChanges={setChanges}
                name="brand"
                placeholder={product.brand}
              />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Category">
              <div className="relative">
                <CustomDropdown
                  showTitle={false}
                  label={"Select Category"}
                  onChange={setCategory}
                  value={category.target.value || "Select Category"}
                  options={categoriesArray}
                />
              </div>
            </FormField>

            <FormField label="Subcategory">
              <div className="relative">
                <Input
                  setChanges={setChanges}
                  name="subcategory"
                  placeholder={product.subcategory}
                />
              </div>
            </FormField>
          </div>

          <div className="relative">
            <div className="flex gap-3">
              <input
                name="tags"
                placeholder="Add new tag"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-600 dark:focus:border-cyan-500"
                ref={tagsQueryRef}
                onFocus={(e) => (e.target.value = tags.join(", "))}
              />

              <button
                type="button"
                onClick={() => {
                  const value = tagsQueryRef.current.value.split(", ");
                  setTags(value);
                  setChanges((prev) => ({
                    ...prev,
                    tags: JSON.stringify(value),
                  }));
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98]"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {tags.map((i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-cyan-400/25 border dark:text-white border-cyan-400 px-3 py-1 text-xs font-medium text-slate-800"
                >
                  {i}
                  <button
                    onClick={() => {
                      const removeItem = tags.filter((it) => it !== i);
                      setTags(removeItem);
                      setChanges((prev) => ({
                        ...prev,
                        tags: JSON.stringify(removeItem),
                      }));
                    }}
                    type="button"
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-400"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <Layers className="h-4 w-4" />
                Product Images
              </div>
              <button
                onClick={() => imageInput.current.click()}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <ImagePlus className="h-4 w-4" />
                Add Image
              </button>
              <input
                setChanges={setChanges}
                type="file"
                ref={imageInput}
                onChange={handleAddImages}
                className="scale-0 opacity-0 w-0 hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {images === "loading" ? (
                <LoaderCircle className="animate-spin size-4 text-cyan-500" />
              ) : (
                images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  >
                    <img
                      loading="lazy"
                      src={image.url}
                      alt="Product preview"
                      className="h-24 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <Package className="h-4 w-4" />
              Status
            </div>

            <div className="space-y-3">
              {product.isActive === "loading" ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin size-4 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {product.isActive}
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setIsActive(!isActive);
                    setChanges((prev) => ({
                      ...prev,
                      isActive: !isActive,
                    }));
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <Power className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${isActive ? "text-green-500" : "text-red-900"}`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <span
                    className={`rounded-full bg-${isActive ? "emerald" : "red"}-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-${isActive ? "emerald" : "red"}-700 dark:bg-${isActive ? "emerald" : "red"}-500/10 dark:text-${isActive ? "emerald" : "red"}-300`}
                  >
                    {isActive ? "Enabled" : "Disabled"}
                  </span>
                </div>
              )}

              {product.featured === "loading" ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin size-4 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {product.featured}
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setIsFeatured(!isFeatured);
                    setChanges((prev) => ({
                      ...prev,
                      featured: !isFeatured,
                    }));
                  }}
                  className="cursor-pointer flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    {isFeatured ? (
                      <Star className="h-4 w-4 text-amber-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${isFeatured ? "text-amber-500" : "text-red-900"}`}
                    >
                      {isFeatured ? "Featured" : "Not Featured"}
                    </span>
                  </div>
                  {isFeatured ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-red-500/10 dark:text-amber-300">
                      YES
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-red-500/10 dark:text-red-300">
                      NO
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        ref={submitRef}
        className="hidden opacity-0 scale-0 w-0"
      ></button>
      <button
        type="button"
        ref={discardRef}
        onClick={discardChanges}
        className="hidden opacity-0 scale-0 w-0"
      ></button>
    </form>
  );
}

function FieldsForm({ isLoading, ...props }) {
  if (isLoading) {
    return <FieldsFormSkeleton />;
  }
  return <FieldsFormComponent {...props} />;
}

export { FieldsFormSkeleton };
export default React.memo(FieldsForm);
