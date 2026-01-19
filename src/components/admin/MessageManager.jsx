import { useState, useEffect } from 'react';
import { adminMessages } from '../../services/adminApi';
import LoadingSpinner from '../LoadingSpinner';

function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, [page, unreadOnly]);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminMessages.getMessages(page, 15, unreadOnly);
      setMessages(data.messages);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminMessages.markAsRead(id);
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, read: true } : msg
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAsReplied = async (id) => {
    try {
      await adminMessages.markAsReplied(id);
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, replied: true, read: true } : msg
      ));
      alert('Message marked as replied successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message? This cannot be undone.')) {
      return;
    }

    try {
      await adminMessages.deleteMessage(id);
      setMessages(messages.filter(msg => msg._id !== id));
      setSelectedMessage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      await handleMarkAsRead(message._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-4 py-2 rounded-lg transition ${
              unreadOnly
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {unreadOnly ? 'Show All' : 'Unread Only'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {unreadOnly ? 'No unread messages.' : 'No messages yet.'}
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message._id}
                      className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition cursor-pointer ${
                        !message.read ? 'bg-blue-500/5' : ''
                      }`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {!message.read && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              New
                            </span>
                          )}
                          {message.replied && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                              Replied
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{message.name}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{message.email}</td>
                      <td className="px-4 py-3 text-gray-300">{message.subject}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message._id);
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onMarkAsReplied={() => handleMarkAsReplied(selectedMessage._id)}
          onDelete={() => handleDelete(selectedMessage._id)}
        />
      )}
    </div>
  );
}

function MessageDetailModal({ message, onClose, onMarkAsReplied, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {message.subject}
              </h3>
              <p className="text-sm text-gray-400">
                {formatDate(message.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* From */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                {message.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{message.name}</p>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  {message.email}
                </a>
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div className="mb-6">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              onClick={onMarkAsReplied}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition"
            >
              Reply via Email
            </a>
            {!message.replied && (
              <button
                onClick={onMarkAsReplied}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Mark as Replied
              </button>
            )}
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageManager;
