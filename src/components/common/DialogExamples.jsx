import React from 'react';
import { X, LogOut, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const Dialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'logout', // 'logout' or 'delete'
  confirmText,
  cancelText = 'Cancel',
  loading = false 
}) => {
  if (!isOpen) return null;

  const getDialogConfig = () => {
    switch (type) {
      case 'delete':
        return {
          icon: Trash2,
          iconBg: 'from-red-500 to-red-600',
          iconColor: 'text-white',
          confirmBg: 'from-red-600 to-red-700',
          confirmHover: 'hover:from-red-700 hover:to-red-800',
          defaultTitle: 'Delete Confirmation',
          defaultMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
          defaultConfirm: 'Delete'
        };
      case 'logout':
      default:
        return {
          icon: LogOut,
          iconBg: 'from-blue-500 to-purple-600',
          iconColor: 'text-white',
          confirmBg: 'from-blue-600 to-purple-600',
          confirmHover: 'hover:from-blue-700 hover:to-purple-700',
          defaultTitle: 'Logout Confirmation',
          defaultMessage: 'Are you sure you want to logout from your account?',
          defaultConfirm: 'Logout'
        };
    }
  };

  const config = getDialogConfig();
  const IconComponent = config.icon;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.iconBg} p-4 text-white relative`}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/20 transition-all duration-200"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {title || config.defaultTitle}
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Message */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {message || config.defaultMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-10 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                {cancelText}
              </Button>
              
              <Button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 h-10 bg-gradient-to-r ${config.confirmBg} ${config.confirmHover} text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  confirmText || config.defaultConfirm
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage Examples Component
const DialogExamples = () => {
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowLogoutDialog(false);
    alert('Logged out successfully!');
  };

  const handleDelete = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowDeleteDialog(false);
    alert('Product deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dialog Examples
          </h1>
          <p className="text-gray-600">Click the buttons below to see the dialogs in action</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setShowLogoutDialog(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Show Logout Dialog
          </Button>
          
          <Button
            onClick={() => setShowDeleteDialog(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Show Delete Dialog
          </Button>
        </div>

        {/* Logout Dialog */}
        <Dialog
          isOpen={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={handleLogout}
          type="logout"
          loading={loading}
        />

        {/* Delete Dialog */}
        <Dialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          type="delete"
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated data."
          confirmText="Delete Product"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DialogExamples;