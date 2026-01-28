import { Routes, Route } from "react-router-dom";
import SmokeBackground from "./components/SmokeBackground";
import Navbar from "./components/Navbar";

import Marketplace from "./pages/Marketplace";
import PosterDetail from "./pages/PosterDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
      {/* 🔥 Animated Background */}
      <SmokeBackground />

      {/* 🔝 Top Navigation */}
      <Navbar />

      {/* 📄 Page Content */}
      <main className="relative z-10 pt-28">
        <Routes>
          {/* 🌍 PUBLIC ROUTES */}
          <Route path="/" element={<Marketplace />} />
          <Route path="/poster/:id" element={<PosterDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
    </>
  );
}

export default App;
