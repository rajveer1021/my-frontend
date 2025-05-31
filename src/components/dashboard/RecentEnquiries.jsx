import React from 'react';
import { MessageSquare, Clock, Mail, RefreshCw, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const RecentEnquiries = ({ enquiries = [], loading = false, onRefresh }) => {
  const newEnquiriesCount = enquiries.filter(e => e.isNew || e.status === 'new' || e.status === 'pending').length;

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch {
      return dateString || 'Unknown';
    }
  };

  const getStatusBadge = (enquiry) => {
    if (enquiry.isNew || enquiry.status === 'new' || enquiry.status === 'pending') {
      return (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
          New
        </span>
      );
    }
    if (enquiry.status === 'responded') {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          Responded
        </span>
      );
    }
    if (enquiry.status === 'closed') {
      return (
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
          Closed
        </span>
      );
    }
    return null;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-purple-600" />
            Recent Enquiries
            {newEnquiriesCount > 0 && (
              <span className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                {newEnquiriesCount} New
              </span>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <button 
                onClick={onRefresh}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
              View All
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading && enquiries.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Loading enquiries...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {enquiries.slice(0, 5).map((enquiry, index) => (
              <div
                key={enquiry.id}
                className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {getInitials(enquiry.name || enquiry.buyerName)}
                    </div>
                    {(enquiry.isNew || enquiry.status === 'new' || enquiry.status === 'pending') && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {enquiry.name || enquiry.buyerName || 'Unknown Customer'}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(enquiry.createdAt || enquiry.date)}
                      </div>
                    </div>

                    {/* Product name if available */}
                    {enquiry.productName && (
                      <div className="flex items-center mb-2">
                        <Package className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-xs text-gray-600">{enquiry.productName}</span>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 group-hover:text-gray-700 transition-colors">
                      {enquiry.message || enquiry.inquiry || 'No message provided'}
                    </p>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(enquiry)}

                      <button
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          const email = enquiry.email || enquiry.buyerEmail || enquiry.customerEmail;
                          const subject = enquiry.productName 
                            ? `Re: Enquiry about ${enquiry.productName}`
                            : 'Re: Product Enquiry';
                          
                          if (email) {
                            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
                          } else {
                            alert('No email address available for this enquiry');
                          }
                        }}
                        title={enquiry.email || enquiry.buyerEmail || enquiry.customerEmail || 'No email available'}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {enquiries.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No enquiries yet</p>
                <p className="text-xs sm:text-sm">
                  Enquiries from buyers will appear here
                </p>
              </div>
            )}

            {enquiries.length > 5 && (
              <div className="text-center pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
                  View {enquiries.length - 5} more enquiries
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};