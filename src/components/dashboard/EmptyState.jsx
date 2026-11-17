'use client';

export default function EmptyState({ title, description, icon: Icon, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 text-gray-400">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-sm">{description}</p>
      {action && actionLabel && (
        <button onClick={action} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}