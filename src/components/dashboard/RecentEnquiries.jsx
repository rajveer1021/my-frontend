import React, { useState } from 'react';
import { MessageSquare, Clock, Mail, RefreshCw, Package, Check, X, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { inquiryService } from '../../services/inquiryService';
import { useToast } from '../ui/Toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';

export const RecentEnquiries = ({ enquiries = [], loading = false, onRefresh }) => {
  const [localEnquiries, setLocalEnquiries] = useState(enquiries);
  const [processingIds, setProcessingIds] = useState(new Set());
  const { addToast } = useToast();

  // Update local state when props change
  React.useEffect(() => {
    setLocalEnquiries(enquiries);
  }, [enquiries]);

  const newEnquiriesCount = localEnquiries.filter(e => 
    e.isNew || e.status === 'new' || e.status === 'open' || e.status === 'pending'
  ).length;

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
    const status = enquiry.status?.toLowerCase() || 'pending';
    
    switch (status) {
      case 'open':
      case 'new':
      case 'pending':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1 rounded-full font-medium">
            Open
          </Badge>
        );
      case 'responded':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1 rounded-full font-medium">
            Responded
          </Badge>
        );
      case 'closed':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs px-2 py-1 rounded-full font-medium">
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-2 py-1 rounded-full font-medium">
            Pending
          </Badge>
        );
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Handle status update
  const handleStatusUpdate = async (enquiryId, newStatus) => {
    if (processingIds.has(enquiryId)) return;

    try {
      setProcessingIds(prev => new Set(prev).add(enquiryId));
      
      const result = await inquiryService.updateInquiryStatus(enquiryId, newStatus);
      
      if (result.success) {
        // Update local state
        setLocalEnquiries(prev => 
          prev.map(enquiry => 
            enquiry.id === enquiryId 
              ? { 
                  ...enquiry, 
                  status: newStatus.toLowerCase(),
                  updatedAt: new Date().toISOString()
                }
              : enquiry
          )
        );

        addToast(
          `Inquiry ${newStatus.toLowerCase() === 'closed' ? 'closed' : 'updated'} successfully`,
          'success'
        );

        // If inquiry was closed, refresh to remove it from the list
        if (newStatus.toUpperCase() === 'CLOSED' && onRefresh) {
          setTimeout(() => {
            onRefresh();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
      addToast(error.message || 'Failed to update inquiry status', 'error');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(enquiryId);
        return newSet;
      });
    }
  };

  // Handle marking as responded
  const handleMarkAsResponded = (enquiryId) => {
    handleStatusUpdate(enquiryId, 'RESPONDED');
  };

  // Handle closing inquiry
  const handleCloseInquiry = (enquiryId) => {
    handleStatusUpdate(enquiryId, 'CLOSED');
  };

  // Handle email reply
  const handleEmailReply = (enquiry) => {
    const email = enquiry.email || enquiry.buyerEmail || enquiry.customerEmail;
    const subject = enquiry.productName 
      ? `Re: Enquiry about ${enquiry.productName}`
      : 'Re: Product Enquiry';
    
    if (email) {
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
      // Also mark as responded after opening email
      setTimeout(() => {
        handleMarkAsResponded(enquiry.id);
      }, 1000);
    } else {
      addToast('No email address available for this enquiry', 'warning');
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 relative overflow-visible">
      <CardHeader className="p-0 mb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-purple-600" />
            Recent Enquiries
            {newEnquiriesCount > 0 && (
              <span className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                {newEnquiriesCount} Open
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

      <CardContent className="p-0 relative">
        {loading && localEnquiries.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Loading enquiries...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {localEnquiries.slice(0, 5).map((enquiry, index) => {
              const isProcessing = processingIds.has(enquiry.id);
              
              return (
                <div
                  key={enquiry.id}
                  className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {getInitials(enquiry.name || enquiry.buyerName)}
                      </div>
                      {(enquiry.isNew || enquiry.status === 'new' || enquiry.status === 'open' || enquiry.status === 'pending') && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {enquiry.name || enquiry.buyerName || 'Unknown Customer'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {getTimeAgo(enquiry.createdAt || enquiry.date)}
                          </div>
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

                        <div className="flex items-center space-x-2">
                          {/* Email Reply Button */}
                          <button
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 px-2 py-1 rounded-lg transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmailReply(enquiry);
                            }}
                            disabled={isProcessing}
                            title={enquiry.email || enquiry.buyerEmail || enquiry.customerEmail || 'No email available'}
                          >
                            <Mail className="w-3 h-3" />
                            <span>Reply</span>
                          </button>

                          {/* Actions Dropdown */}
                          <div className="relative">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <MoreVertical className="w-4 h-4" />
                                  )}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="w-48 z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
                                style={{ 
                                  position: 'fixed',
                                  transform: 'translateX(-100%)',
                                  marginTop: '8px'
                                }}
                              >
                                {enquiry.status !== 'responded' && (
                                  <DropdownMenuItem
                                    onClick={() => handleMarkAsResponded(enquiry.id)}
                                    disabled={isProcessing}
                                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <Check className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="text-sm">Mark as Responded</span>
                                  </DropdownMenuItem>
                                )}
                                
                                {enquiry.status !== 'closed' && (
                                  <DropdownMenuItem
                                    onClick={() => handleCloseInquiry(enquiry.id)}
                                    disabled={isProcessing}
                                    className="flex items-center px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    <span className="text-sm">Close Inquiry</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {localEnquiries.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No enquiries yet</p>
                <p className="text-xs sm:text-sm">
                  Enquiries from buyers will appear here
                </p>
              </div>
            )}

            {localEnquiries.length > 5 && (
              <div className="text-center pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
                  View {localEnquiries.length - 5} more enquiries
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};