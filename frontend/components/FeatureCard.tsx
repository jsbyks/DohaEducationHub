import React from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  gradient?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  link,
  gradient = 'from-blue-500 to-cyan-500',
}) => {
  const content = (
    <div className="feature-card group">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}>
        <div className="text-white text-3xl">
          {icon}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed mb-4">
        {description}
      </p>

      {link && (
        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
          Learn more
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
};
