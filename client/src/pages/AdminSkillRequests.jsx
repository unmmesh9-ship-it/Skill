/**
 * Admin Skill Requests Page
 * Approve or reject employee skill requests
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import PremiumLoading from '../components/PremiumLoading';
import skillRequestService from '../services/skillRequestService';

const AdminSkillRequests = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [stats, setStats] = useState({});
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchRequests();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await skillRequestService.getAllRequests(filter === 'all' ? null : filter);
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to load skill requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await skillRequestService.getStats();
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setAdminResponse('');
    setShowResponseModal(true);
  };

  const handleReject = async (request) => {
    setSelectedRequest(request);
    setActionType('reject');
    setAdminResponse('');
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!selectedRequest) return;

    try {
      if (actionType === 'approve') {
        await skillRequestService.approveRequest(selectedRequest.id, {
          admin_response: adminResponse || 'Request approved'
        });
      } else {
        await skillRequestService.rejectRequest(selectedRequest.id, {
          admin_response: adminResponse || 'Request rejected'
        });
      }

      setShowResponseModal(false);
      setSelectedRequest(null);
      setAdminResponse('');
      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error('Error processing request:', error);
      setError(error.response?.data?.message || 'Failed to process request');
    }
  };

  const getProficiencyLabel = (level) => {
    const labels = ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return labels[level - 1] || 'Unknown';
  };

  if (loading) return <PremiumLoading />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
                <span className="text-5xl">📋</span>
                Skill Requests Management
              </h2>
              <p className="text-blue-100 text-lg">Review and approve employee skill requests</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/90 backdrop-blur border-l-4 border-red-300 text-white px-4 py-3 rounded-r-xl shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="font-bold">{error}</span>
              </div>
              <button onClick={() => setError('')} className="text-white hover:text-red-100 font-bold">✕</button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-100 text-sm font-bold">Pending</p>
              <span className="text-3xl">⏳</span>
            </div>
            <h3 className="text-6xl font-black">{stats.pending || 0}</h3>
            <p className="text-yellow-200 text-xs mt-2 font-semibold">Awaiting review</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-bold">Approved</p>
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-6xl font-black">{stats.approved || 0}</h3>
            <p className="text-green-200 text-xs mt-2 font-semibold">Skills granted</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-red-100 text-sm font-bold">Rejected</p>
              <span className="text-3xl">❌</span>
            </div>
            <h3 className="text-6xl font-black">{stats.rejected || 0}</h3>
            <p className="text-red-200 text-xs mt-2 font-semibold">Denied requests</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-bold">Total</p>
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-6xl font-black">{stats.total || 0}</h3>
            <p className="text-blue-200 text-xs mt-2 font-semibold">All requests</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && ` (${stats[status] || 0})`}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300">
            <span className="text-6xl">📭</span>
            <p className="text-gray-600 mt-4 text-lg font-semibold">
              No {filter !== 'all' ? filter : ''} requests found
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl"
                style={{
                  borderColor:
                    request.status === 'pending'
                      ? '#f59e0b'
                      : request.status === 'approved'
                      ? '#10b981'
                      : '#ef4444',
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {request.user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{request.user?.full_name}</h3>
                        <p className="text-sm text-gray-500">{request.user?.email}</p>
                      </div>
                      <span
                        className="ml-auto px-3 py-1 text-xs font-bold rounded-full"
                        style={{
                          backgroundColor:
                            request.status === 'pending'
                              ? '#fef3c7'
                              : request.status === 'approved'
                              ? '#d1fae5'
                              : '#fee2e2',
                          color:
                            request.status === 'pending'
                              ? '#92400e'
                              : request.status === 'approved'
                              ? '#065f46'
                              : '#991b1b',
                        }}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold">Requested Skill</p>
                        <p className="text-lg font-bold text-blue-900">{request.skill?.name}</p>
                        <p className="text-sm text-blue-700">{request.skill?.category}</p>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold">Proficiency Level</p>
                        <p className="text-lg font-bold text-purple-900">
                          {'⭐'.repeat(request.proficiency_level)} {getProficiencyLabel(request.proficiency_level)}
                        </p>
                      </div>
                    </div>

                    {request.request_message && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Employee's Reason:</p>
                        <p className="text-sm text-gray-600">{request.request_message}</p>
                      </div>
                    )}

                    {request.admin_response && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Admin Response:</p>
                        <p className="text-sm text-blue-700">{request.admin_response}</p>
                        {request.reviewer && (
                          <p className="text-xs text-blue-600 mt-2">
                            Reviewed by: {request.reviewer.name} on{' '}
                            {new Date(request.reviewed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Requested: {new Date(request.created_at).toLocaleDateString()} at{' '}
                      {new Date(request.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(request)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg transition-colors duration-300">
            <h3 className="text-2xl font-bold mb-4">
              {actionType === 'approve' ? '✅ Approve' : '❌ Reject'} Skill Request
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Employee:</span> {selectedRequest.user?.full_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Skill:</span> {selectedRequest.skill?.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Category:</span> {selectedRequest.skill?.category}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Response Message (Optional)
              </label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Add a message for the employee (optional)...'
                    : 'Provide a reason for rejection (recommended)...'
                }
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedRequest(null);
                  setAdminResponse('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitResponse}
                className={`flex-1 px-6 py-3 text-white rounded-lg font-bold transition-all duration-300 ${
                  actionType === 'approve'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                }`}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSkillRequests;
