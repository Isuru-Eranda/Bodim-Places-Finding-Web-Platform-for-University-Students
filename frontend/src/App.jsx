import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListingDetails from "./pages/ListingDetails";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminListings from "./pages/admin/AdminListings";
import AdminReviews from "./pages/admin/AdminReviews";import AdminMessages from './pages/admin/AdminMessages';import ForOwners from "./pages/ForOwners";
import MyProfile from "./pages/MyProfile";
import { AuthProvider, useAuth } from "./context/AuthContext";

const NO_LAYOUT_PATHS = ["/login", "/register"];

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function AdminGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function OwnerGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "owner") return <Navigate to="/" replace />;
  return children;
}

function AuthGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
          {/* Public site */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/listings/:id" element={<ListingDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route
                    path="/profile"
                    element={
                      <AuthGuard>
                        <MyProfile />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/for-owners"
                    element={
                      <OwnerGuard>
                        <ForOwners />
                      </OwnerGuard>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
