import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LandingPage } from "./pages/LandingPage";
import { MenuPage } from "./pages/MenuPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { UpiPaymentPage } from "./pages/UpiPaymentPage";
import { OrderStatusPage } from "./pages/OrderStatusPage";
import { FeedbackPage } from "./pages/FeedbackPage";

export const CustomerApp = () => {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/upi-payment" element={<UpiPaymentPage />} />
        <Route path="/order-status" element={<OrderStatusPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </CartProvider>
  );
};
