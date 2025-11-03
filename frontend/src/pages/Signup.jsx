import { useState, useEffect } from 'react'; // <-- Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserIcon, AtSymbolIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '../api';
import useAuthStore from '../store/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { login, user } = useAuthStore(); // <-- Get the user state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- THIS IS THE FIX ---
  // This effect reacts to a successful login after signup.
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/signup', formData);
      // After signup, we call login, which updates the state.
      // The useEffect will handle the navigation.
      await login(formData.email, formData.password);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Create an Account</h1>
          <p className="mt-2 text-slate-600">Get started with StellarCRM today.</p>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 shadow-xl rounded-2xl border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon className="h-5 w-5 text-slate-400" /></div>
                <input name="name" type="text" value={formData.name} onChange={handleChange} required className="block w-full rounded-md border-slate-300 py-3 pl-10 placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500" placeholder="Full Name"/>
              </div>
            </div>
            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><AtSymbolIcon className="h-5 w-5 text-slate-400" /></div>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="block w-full rounded-md border-slate-300 py-3 pl-10 placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500" placeholder="Email address"/>
              </div>
            </div>
            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon className="h-5 w-5 text-slate-400" /></div>
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required className="block w-full rounded-md border-slate-300 py-3 pl-10 placeholder-slate-500 focus:border-violet-500 focus:ring-violet-500" placeholder="Password"/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600">
                    {showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="group relative flex w-full justify-center rounded-lg border border-transparent bg-theme-accent py-3 px-4 text-sm font-medium text-white hover:bg-theme-accent-hover focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-60">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </div>
          </form>
        </motion.div>
        
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-theme-accent hover:text-theme-accent-hover hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}