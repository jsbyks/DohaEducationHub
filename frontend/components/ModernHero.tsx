import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { imageApi } from '../lib/imageApi';

interface ModernHeroProps {
  title: string;
  subtitle: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  backgroundImage?: string;
  theme?: 'education' | 'school' | 'teacher' | 'community';
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  theme = 'education',
}) => {
  const [bgImage, setBgImage] = useState<string>(backgroundImage || '');

  useEffect(() => {
    if (!backgroundImage) {
      imageApi.getHeroImage(theme).then(setBgImage);
    }
  }, [backgroundImage, theme]);

  return (
    <div className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {bgImage && (
          <img
            src={bgImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-cyan-900/80 to-teal-900/90 backdrop-blur-sm"></div>

        {/* Animated Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-responsive py-20 md:py-32">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl animate-fade-in-delay">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
            {primaryCta && (
              <Link href={primaryCta.href}>
                <button className="btn btn-primary group text-lg px-8 py-4">
                  {primaryCta.text}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <button className="btn bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 text-lg px-8 py-4">
                  {secondaryCta.text}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-slide-up">
          {[
            { label: 'Schools', value: '50+', icon: '🏫' },
            { label: 'Teachers', value: '200+', icon: '👨‍🏫' },
            { label: 'Reviews', value: '1000+', icon: '⭐' },
            { label: 'Students', value: '5000+', icon: '🎓' },
          ].map((stat, index) => (
            <div key={index} className="glass rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
          <path d="M0 120L60 112.5C120 105 240 90 360 82.5C480 75 600 75 720 78.75C840 82.5 960 90 1080 93.75C1200 97.5 1320 97.5 1380 97.5L1440 97.5V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

// Animation keyframes — create and append only on the client
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
  .animate-fade-in-delay {
    opacity: 0;
    animation: fade-in 0.8s ease-out 0.2s forwards;
  }
  .animate-fade-in-delay-2 {
    opacity: 0;
    animation: fade-in 0.8s ease-out 0.4s forwards;
  }
  .animate-slide-up {
    opacity: 0;
    animation: slide-up 1s ease-out 0.6s forwards;
  }
  `;
  document.head.appendChild(style);
}
