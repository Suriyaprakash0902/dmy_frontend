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

import { Toaster } from 'react-hot-toast';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router basename="/dmy">
      <div className="min-h-screen w-full max-w-md mx-auto bg-gray-50 shadow-2xl relative h-screen flex flex-col font-sans">
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', border: '1px solid #C9A84C' }, iconTheme: { primary: '#C9A84C', secondary: '#fff' } }} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />

            <Route element={<MainLayout />}>
              <Route path="/gold-bars" element={<GoldBars />} />
              <Route path="/scheme" element={<Scheme />} />
              <Route path="/scheme/apply" element={<SchemeRegistration />} />
              <Route path="/categories" element={<div className="p-8 text-center text-xl mt-20">Trending Categories coming soon</div>} />
              <Route path="/products" element={<div className="p-8 text-center text-xl mt-20">Trending Products coming soon</div>} />
              <Route path="/wishlist" element={<div className="p-8 text-center text-xl mt-20">Wishlist coming soon</div>} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
