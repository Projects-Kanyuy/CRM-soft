import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AtSymbolIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // This effect will now work correctly because the `user` state
    // will be properly set by the fixed authStore.
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">StellarCRM</h1>
          <p className="mt-2 text-slate-600">Welcome back! Please sign in to your account.</p>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 shadow-xl rounded-2xl border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Form Inputs... same as before */}
            <div><div className="relative"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><AtSymbolIcon className="h-5 w-5 text-slate-400" /></div><input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full rounded-md border-slate-300 py-3 pl-10 text-slate-900 placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500" placeholder="Email address"/></div></div>
            <div><div className="relative"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon className="h-5 w-5 text-slate-400" /></div><input id="password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full rounded-md border-slate-300 py-3 pl-10 text-slate-900 placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500" placeholder="Password"/><div className="absolute inset-y-0 right-0 flex items-center pr-3"><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">{showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}</button></div></div></div>
            <div><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="group relative flex w-full justify-center rounded-lg border border-transparent bg-theme-accent py-3 px-4 text-sm font-medium text-white hover:bg-theme-accent-hover focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-60">{isLoading ? 'Signing in...' : 'Sign in'}</motion.button></div>
          </form>
        </motion.div>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-theme-accent hover:text-theme-accent-hover hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}