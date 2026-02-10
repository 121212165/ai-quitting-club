import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  color?: 'green' | 'orange' | 'blue' | 'red';
}

const colorClasses = {
  green: 'text-primary-500',
  orange: 'text-accent-500',
  blue: 'text-blue-500',
  red: 'text-red-500',
};

export default function StatsCard({ icon, value, label, color = 'green' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <div className={`text-4xl font-bold ${colorClasses[color]} mb-2`}>{value}</div>
        <div className="text-gray-600">{label}</div>
      </div>
    </div>
  );
}
