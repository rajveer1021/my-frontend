import React from 'react';
import { MessageSquare, User, Reply, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
export const RecentEnquiries = ({ enquiries = [] }) => {
  const newEnquiriesCount = enquiries.filter(e => e.isNew).length;

  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleReply = (enquiryId) => {
    // In a real app, this would open a reply modal or navigate to a detailed view
    console.log('Reply to enquiry:', enquiryId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
            Recent Enquiries
          </CardTitle>
          {newEnquiriesCount > 0 && (
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              {newEnquiriesCount} New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {enquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent enquiries</p>
            <p className="text-sm">New customer enquiries will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{enquiry.name}</h4>
                        {enquiry.isNew && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            new
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {getTimeAgo(enquiry.date)}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleReply(enquiry.id)}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pl-13">
                  {enquiry.message}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {enquiries.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              View All Enquiries
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};