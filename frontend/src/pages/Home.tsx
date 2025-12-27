import { type FC } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";

const Home: FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Welcome to</span>{' '}
            <span className="block text-indigo-600 xl:inline">MakerFlow</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Manage your products efficiently. Built with React and designed to scale.
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
            {user ? (
              /* Zalogowany */
              <Link to="/dashboard">
                <Button size="lg" className="px-10 py-6 text-lg bg-indigo-600 hover:bg-indigo-700">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              /* Brak konta */
              <>
                <Link to="/register">
                  <Button size="lg" className="px-10 py-6 text-lg bg-indigo-600 hover:bg-indigo-700">
                    Get started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-10 py-6 text-lg text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                  >
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;