import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  Login,
  Register,
  Dashboard,
  Home,
  Profile,
  Products,
} from "./pages";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<Products />} />
    </Route>
  </Routes>
</BrowserRouter>

  );
}

export default App;