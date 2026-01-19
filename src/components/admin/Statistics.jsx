import { useEffect, useState } from 'react';

function Statistics({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!stats) {
    return (
      <div className="text-center text-gray-400 py-12">
        Loading statistics...
      </div>
    );
  }

  const statCards = [
    { label: 'Total Images', value: stats.totalImages, icon: '🖼️', color: 'blue' },
    { label: 'Total Views', value: stats.totalViews, icon: '👁️', color: 'green' },
    { label: 'Street Photos', value: stats.streetImages, icon: '🏙️', color: 'purple' },
    { label: 'Nature Photos', value: stats.natureImages, icon: '🌿', color: 'emerald' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: '✉️', color: 'red' },
    { label: 'Total Messages', value: stats.totalMessages, icon: '📬', color: 'yellow' },
    { label: 'Recent Uploads', value: stats.recentUploads, icon: '📤', color: 'indigo', subtitle: 'Last 7 days' }
  ];

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
    green: 'from-green-500/20 to-green-600/20 border-green-500/50',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/50',
    red: 'from-red-500/20 to-red-600/20 border-red-500/50',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
    indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/50'
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${colorClasses[card.color]} border rounded-xl p-6 transform transition-all duration-300 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{card.icon}</span>
              <span className="text-3xl font-bold text-white">{card.value}</span>
            </div>
            <p className="text-gray-300 text-sm font-medium">{card.label}</p>
            {card.subtitle && (
              <p className="text-gray-400 text-xs mt-1">{card.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Views by Category */}
      {stats.viewsByCategory && stats.viewsByCategory.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Views by Category</h3>
          <div className="space-y-4">
            {stats.viewsByCategory.map((category) => {
              const percentage = stats.totalViews > 0 ? (category.totalViews / stats.totalViews) * 100 : 0;
              return (
                <div key={category._id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 capitalize">{category._id}</span>
                    <span className="text-gray-400">
                      {category.totalViews} views ({category.count} images)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: mounted ? `${percentage}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Viewed Images */}
      {stats.topImages && stats.topImages.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Top Viewed Images</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Year</th>
                  <th className="pb-3 font-medium text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.topImages.map((image, index) => (
                  <tr
                    key={image._id}
                    className={`text-gray-300 border-b border-gray-700/50 transition-colors ${
                      mounted ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <td className="py-3">{image.title}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs capitalize">
                        {image.category}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{image.location}</td>
                    <td className="py-3 text-sm">{image.year}</td>
                    <td className="py-3 text-right font-semibold">{image.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Upload Trend */}
      {stats.monthlyUploads && stats.monthlyUploads.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Upload Trend (Last 6 Months)</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {stats.monthlyUploads.map((month, index) => {
              const maxCount = Math.max(...stats.monthlyUploads.map(m => m.count));
              const height = (month.count / maxCount) * 100;
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000"
                      style={{ height: mounted ? `${height}%` : '0%', minHeight: month.count > 0 ? '20px' : '0' }}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold">
                        {month.count}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {monthNames[month._id.month - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistics;
