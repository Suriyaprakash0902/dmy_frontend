import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Scheme from "./pages/Scheme";
import SchemeRegistration from "./pages/SchemeRegistration";
import GoldBars from "./pages/GoldBars";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

import { Toaster } from 'react-hot-toast';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AuthRoute = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router basename="/dmy">
      <div className="h-[100dvh] w-full max-w-md mx-auto bg-[#050505] shadow-2xl relative flex flex-col font-sans overflow-y-auto overflow-x-hidden scroll-smooth">
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', border: '1px solid #C9A84C' }, iconTheme: { primary: '#C9A84C', secondary: '#fff' } }} />
        <Routes>
          {/* Prevent logged in users from seeing auth pages */}
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Secure vault routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/gold-bars" element={<GoldBars />} />
              <Route path="/scheme" element={<Scheme />} />
              <Route path="/scheme/apply" element={<SchemeRegistration />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* 404 Page (Gold Vault Theme) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
