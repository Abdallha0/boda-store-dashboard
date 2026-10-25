import React, { useReducer, useEffect, useMemo } from "react";
import ProductHeader from "../components/view-products/header";
import ProductDetailView from "../components/view-products/details";
import Loader from "../components/loader";
import DashboardNotice from "../components/DashboardNotice";
import { getProducts } from "../services/products-api";
import { toastStyles } from "../helpers/tones";
import { toast } from "react-toastify";

const initialState = {
  isLoading: true,
  hasError: false,
  payload: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return { ...state, isLoading: true, hasError: false };
    case "success":
      return {
        ...state,
        isLoading: false,
        hasError: false,
        payload: action.payload,
      };
    case "error":
      return { ...state, isLoading: false, hasError: true };
  }
}

function ViewProductPage() {
  const productId = window.location.pathname.split("/").pop();
  if (!productId) return <Navigate to="/products" replace={true} />;
  const [state, dispatch] = useReducer(reducer, initialState);

  useMemo(() => {
    const controller = new AbortController();
    dispatch({ type: "start" });
    if (productId) {
      getProducts(`/${productId}`, { signal: controller.signal })
        .then((res) => {
          if (controller.signal.aborted) return;
          if (res.success) {
            dispatch({ type: "success", payload: res });
          } else {
            toast.error(
              res.message || "Error occurred while fetching product details",
              {
                style: toastStyles.error,
              },
            );
            dispatch({ type: "error" });
          }
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          toast.error(
            err.message || "Error occurred while fetching product details",
            {
              style: toastStyles.error,
            },
          );
          dispatch({ type: "error" });
        });
    }
    return () => controller.abort();
  }, [productId]);

  const {
    payload: { product },
    isLoading,
    hasError,
  } = state;

  if (isLoading) return <Loader />;
  if (hasError)
    return (
      <main className="p-4 space-y-6">
        <ProductHeader />
        <DashboardNotice
          state={{
            description:
              "Error occurred while fetching product details. Please try again later.",
          }}
        />
      </main>
    );

  return (
    <main className="p-4 space-y-6">
      <ProductHeader title={product.name} subtitle={product.badge || ""} />
      <ProductDetailView product={product} />
    </main>
  );
}

export default React.memo(ViewProductPage);
