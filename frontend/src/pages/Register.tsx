import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{
    username?: string, 
    password?: string,
    password2?: string
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFieldErrors({});

    if(password.length < 8){
      setFieldErrors({ password: "at least 8 characters" });
      return;
    }
    if (password !== password2) {
      setFieldErrors({ password2: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    try{
      const success = await register(username, password);
      if (success) {
        navigate(ROUTES.DASHBOARD.ROOT, { replace: true });
      } else {
        setFieldErrors({ username: "Registration failed" });
      }
    } catch(err){
      setFieldErrors({ username: "Registration failed. Try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean, position: 'top' | 'mid' | 'bot') => {
    const base = "appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";
    const border = hasError ? "border-red-500 z-20" : "border-gray-300";
    const rounded = position === 'top' ? "rounded-t-md" : position === 'bot' ? "rounded-b-md" : "";
    return `${base} ${border} ${rounded}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create new account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* USERNAME */}
            <div className="relative">
              <input
                type="text"
                required
                className={inputClass(!!fieldErrors.username, 'top')}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {fieldErrors.username && (
                <span className="text-red-500 text-xs absolute right-2 top-2.5">★ {fieldErrors.username}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type="password"
                required
                className={inputClass(!!fieldErrors.password, 'mid')}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {fieldErrors.password && (
                <span className="text-red-500 text-xs absolute right-2 top-2.5">
                  ★ {fieldErrors.password}
                </span>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type="password"
                required
                className={inputClass(!!fieldErrors.password2, 'bot')}
                placeholder="repeat Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              {fieldErrors.password2 && (
                <span className="text-red-500 text-xs absolute right-2 top-2.5">★ {fieldErrors.password2}</span>
              )}
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Registration...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
