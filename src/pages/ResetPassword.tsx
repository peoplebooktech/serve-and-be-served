import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setError('Invalid reset link');
      setTokenValid(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      // Validate token format first (basic check)
      if (!token || token.length < 10) {
        setError('Invalid reset link');
        setTokenValid(false);
        return;
      }
      // Token will be fully validated server-side when password is reset
      // This is just a basic format check
      setTokenValid(true);
    } catch (err) {
      setError('Unable to validate reset link');
      setTokenValid(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Use secure edge function to reset password server-side
      const { data, error: resetError } = await supabase.functions.invoke('reset-password-with-token', {
        body: {
          token: token,
          password: password
        }
      });

      if (resetError) {
        setError('Failed to update password. Please try again.');
        setLoading(false);
        return;
      }

      if (data?.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-peoplebook-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-red-50 via-red-50 to-orange-50">
          <div className="w-full max-w-md">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-600">Invalid Reset Link</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 via-green-50 to-emerald-50">
          <div className="w-full max-w-md">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Password Reset Successfully!</CardTitle>
                <CardDescription>
                  Your password has been updated. You can now sign in with your new password.
                  <br />Redirecting to login in a few seconds...
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Reset Your Password</h1>
            <p className="text-slate-600 mt-2">Enter your new password below</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-peoplebook-text">New Password</CardTitle>
              <CardDescription className="text-center">
                Create a strong password for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li className={password.length >= 6 ? 'text-green-600' : ''}>
                      At least 6 characters
                    </li>
                    <li className={password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}>
                      Passwords match
                    </li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90"
                  disabled={loading || password !== confirmPassword || password.length < 6}
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;