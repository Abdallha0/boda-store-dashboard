import React, { useEffect, useState } from "react";
import OrderDetailSidebarSkeleton from "./orderDetailsSidebarSkeleton";
import { toast } from "react-toastify";
import {
  paymentStatusTones,
  statusToneClasses,
  toastStyles,
} from "../../helpers/tones";
import { handleError } from "../../helpers/handleErrorMSG";
import { isAbortError } from "../../helpers/isAbortError";
import { getOrders, updateStatus } from "../../services/orders-api";
import DropdownMenu from "./dropdown";
import { LoaderCircle } from "lucide-react";

function OrderDetailSidebar({ setOrder, targetOrder, onOrderUpdate }) {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ value: "" });
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();

    getOrders(targetOrder, { signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;

        if (!res.success) {
          toast.error(res.message, {
            style: toastStyles.error,
          });
          setOrder(undefined);
          return;
        }

        delete res.success;
        setResponse(res.order);
        setStatus({ value: res.order.status });
        setNote(res.order.customerNote);
      })
      .catch((e) => {
        if (controller.signal.aborted || isAbortError(e)) return;

        toast.error(e.message || "Internal Error!", {
          style: toastStyles.error,
        });
        setResponse(handleError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [targetOrder]);

  const handleSaving = () => {
    if (!status.value || !note) return;
    setIsSaving(true);
    updateStatus(
      targetOrder,
      { status: status.value.toLowerCase(), adminNote: note },
      {},
    )
      .then((res) => {
        if (!res.success) {
          toast.error(res.message, {
            style: toastStyles.error,
          });
          return;
        }

        delete res.success;
        setResponse(res.order);
        setStatus({ value: res.order.status });
        setNote(res.order.customerNote);
        toast.success(res.message, { style: toastStyles.success });
        if (onOrderUpdate) {
          onOrderUpdate(res.order);
        }
      })
      .catch((e) => {
        if (controller.signal.aborted || isAbortError(e)) return;

        toast.error(e.message || "Internal Error!", {
          style: toastStyles.error,
        });
        setResponse(handleError(error));
      })
      .finally(() => setIsSaving(false));
  };

  if (isLoading) return <OrderDetailSidebarSkeleton setOrder={setOrder} />;
  return (
    <aside className="flex fixed top-0 sm:w-screen z-999 right-0 h-screen w-sm max-w-md flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Order detail
          </p>
          <h2 className="mt-0.5 font-mono text-lg font-semibold text-slate-900 dark:text-white">
            #{targetOrder.slice(-8)}
          </h2>
        </div>
        <button
          onClick={() => setOrder(undefined)}
          aria-label="Close"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto coustom-scrollbar px-6 pb-6">
        {/* Badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize " +
              statusToneClasses[status.value]
            }
          >
            <span className="h-1.5 w-1.5 rounded-full border-inherit text-inherit bg-inherit" />
            {status.value}
          </span>
          <span
            className={
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize" +
              paymentStatusTones[response.paymentStatus]
            }
          >
            Payment {response.paymentStatus}
          </span>
        </div>

        {/* Info */}
        <h3 className="mb-1 mt-7 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Info
        </h3>
        <dl>
          <div className="flex justify-between gap-4 border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Placed</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.createdAt
                ? new Date(response.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Customer</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100 capitalize">
              {response.shippingAddress?.fullName ||
                response.user?.username ||
                ""}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Email</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.user?.email || ""}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-slate-500 dark:text-slate-400">Ship to</dt>
            <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
              {response.shippingAddress
                ? `${response.shippingAddress.address}, ${response.shippingAddress.city}`
                : ""}
            </dd>
          </div>
        </dl>

        {/* Items */}
        <h3 className="mb-1 mt-7 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Items
        </h3>
        {response.items?.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 border-b border-slate-100 py-3 dark:border-slate-800"
          >
            {item.image ? (
              <img
                loading="lazy"
                src={item.image}
                alt={item.name}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {item.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                × {item.quantity} · {item.price} $
              </p>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {(item.price * item.quantity).toFixed(2)} $
            </p>
          </div>
        ))}

        {/* Totals */}
        <dl className="mt-1">
          <div className="flex justify-between border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.subtotal?.toFixed(2)} $
            </dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Shipping</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.shippingFee?.toFixed(2)} $
            </dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Tax</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.tax?.toFixed(2)} $
            </dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-3 text-sm dark:border-slate-800">
            <dt className="text-slate-500 dark:text-slate-400">Discount</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.discount?.toFixed(2)} $
            </dd>
          </div>
          <div className="flex justify-between pt-4 text-base font-semibold text-slate-900 dark:text-white">
            <dt>Total</dt>
            <dd>{response.totalPrice?.toFixed(2)} $</dd>
          </div>
        </dl>

        {/* Update status */}
        <h3 className="mb-2 mt-7 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Update status
        </h3>
        <DropdownMenu
          handleChange={setStatus}
          type=""
          styles="relative w-full rounded-lg text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100 capitalize"
          defaultValue={status.value}
          menu={[
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Returned",
          ]}
        />
        <textarea
          rows={3}
          onChange={(e) => setNote(e.target.value)}
          defaultValue={note}
          placeholder=""
          className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        <button
          onClick={handleSaving}
          disabled={
            isSaving ||
            (response.customerNote?.toLowerCase() === note.toLowerCase() &&
              response.status?.toLowerCase() === status.value.toLowerCase())
          }
          className="w-full rounded-lg disabled:bg-gray-400 bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {isSaving ? (
            <span className="flex justify-center gap-2 items-center">
              Saving
              <LoaderCircle className="animate-spin size-4 text-cyan-400" />
            </span>
          ) : (
            "Save changes"
          )}
        </button>
      </footer>
    </aside>
  );
}
export default React.memo(OrderDetailSidebar);
