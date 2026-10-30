import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/loader";
import AccessDenied from "../components/access-denied";

function ProtectedRoute() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <Loader />;
  } else if (status === "unauthenticated" || !user) {
    return <Navigate replace to="/login" />;
  }

  if (!user.role || user.role !== "admin") {
    return <AccessDenied />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
