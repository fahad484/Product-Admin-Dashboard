import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login(username, password);
      navigate('/products');
    } catch (err) {
      setError('Invalid username or password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-800/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">ProductHub</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <p className="text-xs text-slate-500 text-center mb-1">Demo credentials</p>
          <p className="text-xs text-slate-400 text-center font-mono">emilys / emilyspass</p>
        </div>
      </div>
    </div>
  );
}
