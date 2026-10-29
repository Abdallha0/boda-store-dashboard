import React, { createContext, useEffect, useReducer, useState } from "react";
import ProductsHeader from "../components/products/header";
import StatCard from "../components/products/statsCard";
import ProductsSearchForm from "../components/products/searchForm";
import ProductGrid from "../components/products/productsGrid";
import EditProductModal from "../components/edit-products/editModel";
import { getProducts } from "../services/products-api";
import { toast } from "react-toastify";
import { isAbortError } from "../helpers/isAbortError";
import { toastStyles } from "../helpers/tones";
import Loader from "../components/loader";
import SimplePagination from "../components/orders/pagination";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import ProductCardSkeleton from "../components/products/productsSkeleton";
export const QuickEditContext = createContext();

function Reducer(state, action) {
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
    case "delete":
      return {
        ...state,
        payload: {
          ...state.payload,
          products: state.payload.products.filter(
            (item) => item._id !== action.payload,
          ),
          totalProducts: Math.max(0, (state.payload.totalProducts || 1) - 1),
        },
      };
    default:
      return state;
  }
}
const initialState = {
  isLoading: true,
  hasError: false,
  payload: {
    products: [],
    success: false,
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
    stats: {
      inStock: 0,
      outOfStock: 0,
      featured: 0,
    },
  },
};

function ProductsPage() {
  const [P, setP] = useSearchParams("");
  const [quickEdit, setQuickEdit] = useState(P.get("edit"));
  const [CurrentPage, setCurrentPage] = useState(1);
  const [parameters, setFilterParameters] = useState(
    typeof window !== "undefined" && location.search,
  );

  const handleFilterChange = (newParams) => {
    setFilterParameters(newParams);
    setCurrentPage(1);
  };

  const [state, dispatch] = useReducer(Reducer, initialState);
  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: "start" });

    const query = new URLSearchParams(
      typeof parameters === "string" && parameters.startsWith("?")
        ? parameters.slice(1)
        : parameters || "",
    );
    query.set("page", CurrentPage);
    query.delete("edit");

    const searchVal = query.get("search");
    const isSearch = Boolean(searchVal && searchVal.trim());
    const queryString = query.toString();
    const endpoint = isSearch ? `/search?${queryString}` : `?${queryString}`;

    getProducts(endpoint.toLowerCase().replaceAll(" ", ""), {
      signal: controller.signal,
    })
      .then((res) => {
        if (controller.signal.aborted) return;

        if (!res.success) {
          toast.error(res.message, {
            style: toastStyles.error,
          });
          dispatch({ type: "error" });
          return;
        }
        dispatch({ type: "success", payload: res });
        if (res.currentPage && res.currentPage !== CurrentPage) {
          setCurrentPage(res.currentPage);
        }
      })
      .catch((e) => {
        if (controller.signal.aborted || isAbortError(e)) return;

        toast.error(e.message || "Internal Error!", {
          style: toastStyles.error,
        });
        dispatch({ type: "error" });
      });

    return () => {
      controller.abort();
    };
  }, [parameters, CurrentPage]);

  const {
    hasError,
    isLoading,
    payload: { products, totalProducts, totalPages, currentPage, categories },
  } = state;

  const stats = {
    totalProducts: totalProducts ?? 0,
    featured: products?.filter((i) => i.featured).length || 0,
    inStock: products?.filter((i) => i.stock >= 1).length || 0,
    outOfStock: products?.filter((i) => i.stock < 1).length || 0,
  };

  useEffect(() => {
    const currentEdit = P.get("edit");
    if (quickEdit && currentEdit !== quickEdit) {
      setP(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("edit", quickEdit);
          return next;
        },
        { replace: true },
      );
    } else if (!quickEdit && currentEdit) {
      setP(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("edit");
          return next;
        },
        { replace: true },
      );
    }
  }, [quickEdit, P, setP]);

  function deleteProduct(id, name) {
    const answer = confirm(
      "Are You Sure that you want to delete " + (name || "this product") + "?",
    );
    if (!answer) return;

    api
      .delete("/products/" + id)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message, { style: toastStyles.success });
          dispatch({
            type: "delete",
            payload: id,
          });
        } else {
          toast.error(res.data.message, { style: toastStyles.error });
        }
      })
      .catch((e) => {
        toast.error(
          e.response?.data?.message || e.message || "internal server error",
          {
            style: toastStyles.error,
          },
        );
      });
  }

  if(isLoading) return <ProductCardSkeleton />

  return (
    <main className="p-4 space-y-6">
      <ProductsHeader />
      <StatCard stats={{ ...stats, totalProducts }} />
      <ProductsSearchForm categories={categories} setFilterParameters={handleFilterChange} />
      <QuickEditContext.Provider
        value={{ quickEdit, setQuickEdit, deleteProduct }}
      >
        <ProductGrid isLoading={isLoading} products={products} />
      </QuickEditContext.Provider>
      {quickEdit && (
        <EditProductModal productId={quickEdit} removeProduct={setQuickEdit} />
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center">
          <SimplePagination
            currentPage={currentPage || CurrentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </main>
  );
}

export default ProductsPage;
