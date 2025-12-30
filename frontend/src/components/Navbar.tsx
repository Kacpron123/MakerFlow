import { type FC } from 'react';
import { Link, useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '@/constants/routes';

const Navbar: FC = () => {
  // Zakładamy, że useAuth zwraca typy zdefiniowane w Twoim AuthContext
  const { user, logout } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={ROUTES.HOME} className="shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">MakerFlow</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link to={ROUTES.DASHBOARD.ROOT} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to={ROUTES.PROFILE} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;