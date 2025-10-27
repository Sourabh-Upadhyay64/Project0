import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Lazy load pages for better performance
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage }))
);
const MenuPage = lazy(() =>
  import("./pages/MenuPage").then((m) => ({ default: m.MenuPage }))
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage }))
);
const UpiPaymentPage = lazy(() =>
  import("./pages/UpiPaymentPage").then((m) => ({ default: m.UpiPaymentPage }))
);
const OrderStatusPage = lazy(() =>
  import("./pages/OrderStatusPage").then((m) => ({
    default: m.OrderStatusPage,
  }))
);
const FeedbackPage = lazy(() =>
  import("./pages/FeedbackPage").then((m) => ({ default: m.FeedbackPage }))
);

// Loading component for page transitions
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

export const CustomerApp = () => {
  return (
    <CartProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/upi-payment" element={<UpiPaymentPage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="*" element={<Navigate to="/customer" replace />} />
        </Routes>
      </Suspense>
    </CartProvider>
  );
};
