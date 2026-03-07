
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import IntroVideo from "./pages/IntroVideo";
import Marketplace from "./pages/Marketplace";
import PosterDetail from "./pages/PosterDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Faqs from "./pages/Faqs";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import SellerRoute from "./routes/SellerRoute";
import AdminRoute from "./routes/AdminRoute";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import MyOrders from "./pages/MyOrders";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminWithdrawals from "./pages/AdminWithdrawals";


function App() {
  return (
    <>
      <Navbar />

      <div className="pt-28 md:pt-32">
        <main>
          <Routes>
            <Route path="/intro" element={<IntroVideo />} />

            <Route path="/" element={<Marketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />

            <Route path="/poster/:id" element={<PosterDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faqs" element={<Faqs />} />

            {/* 🧑‍🎨 SELLER ROUTE */}
            <Route
              path="/seller"
              element={
                <SellerRoute>
                  <SellerDashboard />
                </SellerRoute>
              }
            />

            {/* 🔐 ADMIN ROUTE */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />

            <Route path="/orders" element={<MyOrders />} />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/withdrawals"
              element={
                <AdminRoute>
                  <AdminWithdrawals />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
