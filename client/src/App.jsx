import { Component, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import UserSidebar from "./components/layout/UserSidebar";
import AdminSidebar from "./components/layout/AdminSidebar";
import CompareBar from "./components/ui/CompareBar";
import Loader from "./components/ui/Loader";
import { useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import CarsPage from "./pages/CarsPage";
import CarDetailPage from "./pages/CarDetailPage";
import ComparePage from "./pages/ComparePage";
import BrandsPage from "./pages/BrandsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserDashboard from "./pages/user/UserDashboard";
import SavedCars from "./pages/user/SavedCars";
import Inspections from "./pages/user/Inspections";
import TestDrives from "./pages/user/TestDrives";
import Installments from "./pages/user/Installments";
import RecentlyViewed from "./pages/user/RecentlyViewed";
import Messages from "./pages/user/Messages";
import UserProfile from "./pages/user/UserProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCars from "./pages/admin/AdminCars";
import AddCar from "./pages/admin/AddCar";
import EditCar from "./pages/admin/EditCar";
import AdminInspections from "./pages/admin/AdminInspections";
import AdminTestDrives from "./pages/admin/AdminTestDrives";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSales from "./pages/admin/AdminSales";
import AdminSettings from "./pages/admin/AdminSettings";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-shell">
          <div className="empty-state">
            <h1>Something went wrong</h1>
            <p>Refresh the page or return to inventory.</p>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? children : <Navigate to="/dashboard" replace />;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function DashboardLayout() {
  return (
    <>
      <Navbar />
      <div className="dashboard-shell">
        <UserSidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="dashboard-shell">
        <AdminSidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #333" } }} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:slug" element={<CarDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<UserDashboard />} />
          <Route path="saved" element={<SavedCars />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="test-drives" element={<TestDrives />} />
          <Route path="installments" element={<Installments />} />
          <Route path="viewed" element={<RecentlyViewed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="cars/add" element={<AddCar />} />
          <Route path="cars/:id/edit" element={<EditCar />} />
          <Route path="inspections" element={<AdminInspections />} />
          <Route path="test-drives" element={<AdminTestDrives />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      <CompareBar />
      <BackToTop />
    </ErrorBoundary>
  );
}

export default App;
