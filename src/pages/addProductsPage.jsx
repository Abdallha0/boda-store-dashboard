import React, { useEffect, useState } from "react";
import AddProductsHeader from "../components/add-products/header";
import ImgUploaderSec from "../components/add-products/imgUploaderSec";
import EnteredDataSec from "../components/add-products/enteredDataSec";
import { addProducts } from "../services/products-api";
import { toast } from "react-toastify";
import { toastStyles } from "../helpers/tones";
import { LoaderCircle } from "lucide-react";

export const ProductsInitialDate = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  sku: "",
  category: "",
  subcategory: "",
  brand: "",
  badge: "",
  tags: [],
  isActive: false,
  featured: false,
};

function AddProductsPage() {
  const [productGallery, setProductGallery] = useState([]);
  const [productData, setProductData] = useState({
    ...ProductsInitialDate,
    tags: [],
  });
  const [resetSignal, setResetSignal] = useState(0);

  const [isSaving, setSaving] = useState(false);

  const resetFormState = () => {
    setProductGallery([]);
    setProductData({ ...ProductsInitialDate, tags: [] });
    sessionStorage.removeItem("productData");
    setResetSignal((prev) => prev + 1);
  };

  // Module level: created once, not on every render
  const OPTIONAL_FIELDS = new Set([
    "discountPrice",
    "badge",
    "featured",
    "isActive",
  ]);
  const MIN_LENGTHS = { shortDescription: 10, description: 20 };

  const isEmpty = (value) =>
    value == null || (typeof value === "string" && value.trim() === "");

  function validateProduct(payload) {
    const { images, tags, ...rest } = payload;

    if (!images?.length) return "You should add at least one image";

    let parsedTags = null;
    try {
      parsedTags = JSON.parse(tags);
    } catch {
      // falls through to the check below
    }
    if (!Array.isArray(parsedTags) || parsedTags.length < 1) {
      return "You should add at least one tag";
    }

    for (const [key, value] of Object.entries(rest)) {
      if (isEmpty(value)) {
        if (!OPTIONAL_FIELDS.has(key)) return `${key} is required`;
        continue;
      }
      const min = MIN_LENGTHS[key];
      if (min && String(value).trim().length < min) {
        return `${key} must be at least ${min} characters long`;
      }
    }

    return null;
  }

  function buildFormData(payload) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else if (value != null) {
        formData.append(key, value); // tags goes through here as a JSON string
      }
    }
    return formData;
  }

  // Inside your component
  const onPublish = async () => {
    const productPayload = {
      ...productData,
      tags: JSON.stringify(productData.tags),
      images: productGallery,
    };

    const validationError = validateProduct(productPayload);
    if (validationError) {
      toast.info(validationError, { style: toastStyles.info });
      return; // setSaving(true) has not been called yet
    }

    setSaving(true);
    try {
      const response = await addProducts(buildFormData(productPayload));

      if (response?.success) {
        toast.success(response.message || "Product added successfully!", {
          style: toastStyles.success,
        });
        resetFormState();
      } else {
        toast.error(response?.message || "Failed to add product.", {
          style: toastStyles.error,
        });
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Error adding product.", { style: toastStyles.error });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-4 space-y-6">
      {isSaving && (
        <div className=" w-full lg:w-[calc(100%-18rem)] flex justify-center items-center right-0 fixed z-10">
          <LoaderCircle className="animate-spin size-8 text-cyan-400" />
        </div>
      )}
      <AddProductsHeader
        title="Create Product"
        subtitle="Launch a polished product entry"
        description="Add products with validation, image previews, multi-upload support, and smooth UX."
      />
      <div className="flex flex-col gap-4 lg:flex-row ">
        <ImgUploaderSec
          setProductGallery={setProductGallery}
          resetSignal={resetSignal}
        />
        <EnteredDataSec
          productData={productData}
          onPublish={onPublish}
          setProductData={setProductData}
          isSaving={isSaving}
          resetSignal={resetSignal}
        />
      </div>
    </main>
  );
}

export default AddProductsPage;
