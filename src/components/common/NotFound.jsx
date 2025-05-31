import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

export const NotFound = ({ onNavigateHome, message = "Page not found" }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-400">404</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {message}
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={onNavigateHome} 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
