import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Smartphone, Apple } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthScreenProps {
  onSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Full name would be handled in AuthContext after profile creation
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F0] flex flex-col p-8">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-[#075B3B]">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin 
              ? 'Login to continue shopping your favorites.' 
              : 'Sign up to enjoy fresh groceries delivered to your doorstep.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="input-field pl-12"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="input-field pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field pl-12 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-xs font-semibold text-[#075B3B]">
                Forgot Password?
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full shadow-lg shadow-[#075B3B]/20 h-14"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-[1px] bg-gray-200 flex-1" />
          <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">Or continue with</span>
          <div className="h-[1px] bg-gray-200 flex-1" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center h-14 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-red-500" />
          </button>
          <button className="flex items-center justify-center h-14 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
            <Apple size={24} />
          </button>
          <button className="flex items-center justify-center h-14 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
            <Smartphone size={24} className="text-[#075B3B]" />
          </button>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#075B3B] font-bold"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthScreen;
