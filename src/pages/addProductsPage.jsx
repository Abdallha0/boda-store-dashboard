import React, { useEffect, useState } from "react";
import AddProductsHeader from "../components/add-products/header";
import ImgUploaderSec from "../components/add-products/imgUploaderSec";
import EnteredDataSec from "../components/add-products/enteredDataSec";
import { addProducts } from "../services/products-api";
import { toast } from "react-toastify";
import { toastStyles } from "../helpers/tones";
import { LoaderCircle } from "lucide-react";
import { body } from "framer-motion/client";

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

  const onPublish = () => {
    setSaving(true);
    const productPayload = {
      ...productData,
      tags: JSON.stringify(productData.tags),
      images: productGallery,
    };
    const formData = new FormData();

    for (const [key, value] of Object.entries(productPayload)) {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else if (!value) {
        toast.info("Please fill all fields", { style: toastStyles.info });
        setSaving(false);
        return;
      } else {
        formData.append(key, value);
      }
    }

    addProducts(formData)
      .then((response) => {
        if (response && response.success) {
          toast.success(response.message || "Product added successfully!", {
            style: toastStyles.success,
          });
          resetFormState();
        } else {
          toast.error(response.message || "Failed to add product.", {
            style: toastStyles.error,
          });
        }
        setSaving(false);
      })
      .catch((error) => {
        setSaving(false);
        toast.error("Error adding product.", {
          style: toastStyles.error,
        });
      });
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
