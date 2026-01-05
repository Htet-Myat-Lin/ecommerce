import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { EmailVerification } from "./pages/auth/EmailVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Unauthorized } from "./pages/Unauthorized";
import { AdminLayout } from "./components/layouts/admin.layout";
import { Dashboard } from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import { Products } from "./pages/admin/Products";
import { Categories } from "./pages/admin/Categories";
import { ProductDetail } from "./pages/products/ProductDetail";
import { ProductListing } from "./pages/products/ProductListing";
import { CartItems } from "./pages/cart/CartItems";
import { Payment } from "./pages/payment/Payment";
import { NotificationsPage } from "./pages/NotificationsPage";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import { WishlistPage } from "./pages/WishlistPage";
import { useNotificationsQuery } from "./hooks/queries";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useNotificationsQuery()
  useNotificationSocket()

  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartItems />} />
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/payment/:orderId" element={<Payment />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
