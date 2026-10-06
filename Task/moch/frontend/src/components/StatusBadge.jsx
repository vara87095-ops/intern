import React from 'react';
import { Clock, RefreshCw, Truck, CheckCircle2, XCircle } from 'lucide-react';

const statusConfig = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  Processing: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: RefreshCw,
  },
  Shipped: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Truck,
  },
  Delivered: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  Cancelled: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
};

const StatusBadge = ({ status = 'Pending', size = 'sm' }) => {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1.5 text-sm gap-2 font-medium'
      : 'px-2.5 py-1 text-xs gap-1.5 font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      {status}
    </span>
  );
};

export default StatusBadge;
