'use client';

import { useState, useEffect } from 'react';

const gradientConfigs = {
  primary: { from: 'from-indigo-500', to: 'to-indigo-600', icon: 'text-indigo-400', bg: 'bg-indigo-50' },
  success: { from: 'from-emerald-500', to: 'to-emerald-600', icon: 'text-emerald-400', bg: 'bg-emerald-50' },
  warning: { from: 'from-amber-500', to: 'to-amber-600', icon: 'text-amber-400', bg: 'bg-amber-50' },
  danger: { from: 'from-rose-500', to: 'to-rose-600', icon: 'text-rose-400', bg: 'bg-rose-50' },
  info: { from: 'from-blue-500', to: 'to-blue-600', icon: 'text-blue-400', bg: 'bg-blue-50' },
};

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, variant = 'primary', footer }) {
  const config = gradientConfigs[variant] || gradientConfigs.primary;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden group border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${config.bg}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{value}</span>
              {trend && (
                <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trend > 0 ? '+' : ''}{trend}% {trendLabel}
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${config.icon} bg-white/50 backdrop-blur-sm shadow-sm`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* Subtle background pattern */}
        <div className="mt-auto pt-6 border-t border-white/40">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đang hoạt động
            </span>
          </div>
        </div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}