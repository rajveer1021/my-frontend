import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export const ErrorMessage = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content.", 
  onRetry = null,
  showHomeButton = false 
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-center max-w-md">
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        {showHomeButton && (
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        )}
      </div>
    </div>
  </div>
);

export const EmptyState = ({ 
  title = "No items found", 
  message = "We couldn't find any items matching your criteria.", 
  icon: Icon = null,
  action = null 
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-center max-w-md">
      {Icon && (
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {action && action}
    </div>
  </div>
);

// Network Error Component
export const NetworkError = ({ onRetry }) => (
  <ErrorMessage
    title="Connection Problem"
    message="Please check your internet connection and try again."
    onRetry={onRetry}
  />
);

// 404 Not Found Component
export const NotFound = () => (
  <ErrorMessage
    title="Page Not Found"
    message="The page you're looking for doesn't exist or has been moved."
    showHomeButton={true}
  />
);