import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./pages/Home";
import ProductCatalog from "./components/customer/ProductCatalog";
import Cart from "./components/customer/Cart";
import Checkout from "./components/customer/Checkout";
import OrderSuccess from "./components/customer/OrderSuccess";
import OrderHistory from "./components/customer/OrderHistory";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProductManagement from "./components/admin/ProductManagement";
import SalesReports from "./components/admin/SalesReports";
import UserManagement from "./components/admin/UserManagement";
import StaffDashboard from "./components/staff/StaffDashboard";
import StaffSalesHistory from "./components/staff/StaffSalesHistory";
import StaffSalesEntry from "./components/staff/StaffSalesEntry";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/cart" element={<Cart />} />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sales"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <SalesReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/staff/dashboard"
                  element={
                    <ProtectedRoute roles={["staff"]}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/sales-entry"
                  element={
                    <ProtectedRoute roles={["staff"]}>
                      <StaffSalesEntry />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/sales-history"
                  element={
                    <ProtectedRoute roles={["staff"]}>
                      <StaffSalesHistory />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
