import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Loader from "./components/loader";
import OfflinePage from "./components/OfflinePage";
import useOnlineStatus from "./hooks/useOnlineStatus";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/404"));
const CartPage = lazy(() => import("./pages/CartPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const AddProductsPage = lazy(() => import("./pages/addProductsPage"));
const ViewProductPage = lazy(() => import("./pages/ViewProductPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));

function App() {
  const isOnline = useOnlineStatus();

  if (!isOnline) return <OfflinePage />;

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/view/:id" element={<ViewProductPage />} />
                <Route path="products/add" element={<AddProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="carts" element={<CartPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer
        style={{ backgroundColor: "transparent" }}
        closeButton={false}
        hideProgressBar
      />
    </>
  );
}

export default App;
