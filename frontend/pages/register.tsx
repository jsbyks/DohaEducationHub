import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    if (value && value.length < 2) {
      setFullNameError('Full name must be at least 2 characters');
    } else {
      setFullNameError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFullNameError('');

    // Validation
    let hasError = false;

    if (!fullName) {
      setFullNameError('Full name is required');
      hasError = true;
    } else if (fullName.length < 2) {
      setFullNameError('Full name must be at least 2 characters');
      hasError = true;
    }

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await register(email, password, fullName || undefined);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Register"
        description="Create a new account for Doha Education Hub."
        path="/register"
      />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Doha Education Hub</h1>
          <p className="text-lg text-gray-600">Create your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name (Optional)"
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              error={fullNameError}
              autoComplete="name"
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              id="register-password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordError}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

            <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link legacyBehavior href="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link legacyBehavior href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
