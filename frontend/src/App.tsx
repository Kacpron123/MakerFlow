import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Login,
  Register,
  Dashboard,
  Home,
  Profile,
  Products,
  Inventory,
} from "@/pages";
import { ROUTES } from '@/constants/routes';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path={ROUTES.HOME} element={<Home />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />

    {/* protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path={ROUTES.DASHBOARD.ROOT} element={<Dashboard />} />
      <Route path={ROUTES.DASHBOARD.PRODUCTS} element={<Products />} />
      <Route path={ROUTES.DASHBOARD.INVENTORY} element={<Inventory />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
    </Route>
  </Routes>
</BrowserRouter>

  );
}

export default App;