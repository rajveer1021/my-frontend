import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Mail } from 'lucide-react';
import { useToast } from '../ui/Toast';

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      addToast("Please fill in all fields", "error");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        addToast("Welcome back!", "success");
      }
    } catch (error) {
      addToast("Invalid credentials. Please try again.", "error");
    }
  };

  const handleGoogleLogin = () => {
    addToast("Google authentication would be integrated here.", "info");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your vendor account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGoogleLogin}
          variant="outline" 
          className="w-full"
          type="button"
        >
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button 
            variant="ghost" 
            onClick={onForgotPassword}
            className="text-sm"
          >
            Forgot your password?
          </Button>
          
          <div className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Button variant="ghost" onClick={onSwitchToSignup} className="p-0 text-blue-600 hover:text-blue-700">
              Sign up
            </Button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
          <p className="text-xs"><strong>Vendor:</strong> vendor@example.com</p>
          <p className="text-xs"><strong>Buyer:</strong> buyer@example.com</p>
          <p className="text-xs">Password: any password</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;