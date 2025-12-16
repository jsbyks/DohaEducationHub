import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../components/SEO';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Doha Education Hub!',
    description: 'Your journey to finding the perfect school starts here. Let\'s get you set up.',
    icon: '👋',
  },
  {
    title: 'Explore Schools',
    description: 'Browse our comprehensive directory of schools in Doha. Use filters to find schools that match your preferences.',
    icon: '🏫',
    action: '/schools',
    actionText: 'Browse Schools',
  },
  {
    title: 'Find Teachers',
    description: 'Connect with qualified teachers for private tutoring sessions. Compare profiles and book sessions easily.',
    icon: '👨‍🏫',
    action: '/teachers',
    actionText: 'Find Teachers',
  },
  {
    title: 'Save Favorites',
    description: 'Save schools you\'re interested in and compare them side-by-side to make the best decision.',
    icon: '❤️',
    action: '/schools',
    actionText: 'Start Exploring',
  },
  {
    title: 'Leave Reviews',
    description: 'Share your experiences and help other parents make informed decisions.',
    icon: '⭐',
    action: '/dashboard',
    actionText: 'Go to Dashboard',
  },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      localStorage.setItem('onboarding_complete', 'true');
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_complete', 'true');
    router.push('/dashboard');
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <ProtectedRoute>
      <SEO
        title="Welcome to Doha Education Hub"
        description="Complete your onboarding to get started with finding the perfect school."
        path="/onboarding"
      />

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <div className="p-8 text-center">
              <div className="text-6xl mb-6">{step.icon}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h1>
              <p className="text-lg text-gray-600 mb-8">{step.description}</p>

              <div className="flex gap-4 justify-center">
                {step.action ? (
                  <Link href={step.action}>
                    <Button size="lg" onClick={handleNext}>
                      {step.actionText}
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" onClick={handleNext}>
                    {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}