import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Mail } from 'lucide-react';
import { useToast } from '../ui/Toast';

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userType: 'vendor',
    password: '',
    confirmPassword: ''
  });
  
  const { signup, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast("Please fill in all fields", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    try {
      const success = await signup({
        fullName: formData.fullName,
        email: formData.email,
        userType: formData.userType
      });

      if (success) {
        addToast("Account created successfully!", "success");
      }
    } catch (error) {
      addToast("Failed to create account. Please try again.", "error");
    }
  };

  const handleGoogleSignup = () => {
    addToast("Google authentication would be integrated here.", "info");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join our marketplace platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGoogleSignup}
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
            <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Account Type</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="vendor"
                  name="userType"
                  value="vendor"
                  checked={formData.userType === 'vendor'}
                  onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                  className="h-4 w-4"
                />
                <label htmlFor="vendor" className="text-sm">Vendor (Sell products)</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="buyer"
                  name="userType"
                  value="buyer"
                  checked={formData.userType === 'buyer'}
                  onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value }))}
                  className="h-4 w-4"
                />
                <label htmlFor="buyer" className="text-sm">Buyer (Purchase products)</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center">
          <div className="text-sm text-gray-500">
            Already have an account?{' '}
            <Button variant="ghost" onClick={onSwitchToLogin} className="p-0 text-blue-600 hover:text-blue-700">
              Sign in
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;