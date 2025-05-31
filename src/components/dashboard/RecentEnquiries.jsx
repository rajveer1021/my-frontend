import React from 'react';
import { MessageSquare, Clock, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const RecentEnquiries = ({ enquiries = [] }) => {
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Simplified for consistency
    } catch {
      return dateString;
    }
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
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
            View All
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
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
                    {enquiry.buyerName?.charAt(0) || 'U'}
                  </div>
                  {enquiry.status === 'new' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {enquiry.buyerName}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(enquiry.date)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 group-hover:text-gray-700 transition-colors">
                    {enquiry.message}
                  </p>

                  <div className="flex items-center justify-between">
                    {enquiry.status === 'new' ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    ) : <div />}

                    <button
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-300"
                      onClick={() =>
                        window.open(
                          `mailto:${enquiry.buyerEmail}?subject=Re: Product Enquiry`
                        )
                      }
                    >
                      <Mail className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {enquiries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm sm:text-base">No enquiries yet</p>
              <p className="text-xs sm:text-sm">
                Enquiries from buyers will appear here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
