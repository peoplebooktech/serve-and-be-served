import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  Lightbulb, 
  HandHeart,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SecurityIndicator } from '@/components/SecurityIndicator';
import { validateSignInForm, validateSignUpForm, getPasswordStrength } from '@/lib/validation';


const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('consumer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const { signUp, signIn, resendConfirmation, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roles = [
    {
      id: 'consumer' as AppRole,
      title: 'Consumer',
      description: 'Individuals, communities, or organizations seeking AI-matched expertise and knowledge',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'producer' as AppRole,
      title: 'Producer',
      description: 'Share your expertise through our AI-powered platform and guide others to success',
      icon: Lightbulb,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'ad_hoc' as AppRole,
      title: 'Ad-Hoc',
      description: 'Represent and facilitate AI-enhanced connections between consumers and producers',
      icon: HandHeart,
      color: 'from-green-500 to-teal-600'
    }
  ];

  // Clear all auth state on component mount for fresh start
  useEffect(() => {
    // Clear localStorage on mount for fresh start
    localStorage.removeItem('supabase.auth.token');
    
    // Reset all form state
    setEmail('');
    setPassword('');
    setName('');
    setSelectedRole('consumer');
    setLoading(false);
    setError('');
    setMessage('');
    setShowResend(false);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setCurrentStep(1);
  }, []);

  useEffect(() => {
    // Redirect authenticated users to their intended destination
    if (user) {
      const from = location.state?.from || '/profiles';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setError('');
    setMessage('');
    setValidationErrors([]);
    setShowResend(false);
    setCurrentStep(1);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (attemptCount >= 5) {
      setError('Too many attempts. Please wait a few minutes before trying again.');
      return;
    }

    // Validate form data
    const validation = validateSignUpForm({
      name,
      email,
      password,
      confirmPassword
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setValidationErrors([]);
    setAttemptCount(prev => prev + 1);

    console.log('Form submitted for signup with email:', email);
    console.log('Current URL origin:', window.location.origin);

    try {
      const { error } = await signUp(email, password, name, selectedRole);

      console.log('Signup completed with error:', error);

      if (error) {
        console.error('Signup form error:', error);
        setError(error.message || 'An error occurred during signup');
        
        if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
          setShowResend(true);
        }
      } else {
        console.log('Signup successful, showing success message');
        setMessage('🎉 Account created successfully! Please check your email (including spam folder) for the confirmation link.');
        setShowResend(true);
        setCurrentStep(1);
        // Clear sensitive form data
        setPassword('');
        setConfirmPassword('');
        setName('');
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await resendConfirmation(email);

      if (error) {
        setError(error.message || 'Failed to resend confirmation email');
      } else {
        setMessage('Confirmation email sent! Please check your inbox and spam folder.');
        setShowResend(false);
      }
    } catch (err: any) {
      setError('Failed to resend confirmation email. Please try again.');
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (attemptCount >= 10) {
      setError('Too many sign-in attempts. Please wait a few minutes before trying again.');
      return;
    }

    // Validate form data
    const validation = validateSignInForm({ email, password });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setValidationErrors([]);
    setShowResend(false);
    setAttemptCount(prev => prev + 1);

    console.log('Attempting sign in with email:', email);

    try {
      const { error } = await signIn(email, password);

      console.log('Sign in completed with error:', error);

      if (error) {
        console.error('Signin form error:', error);
        
        // Provide user-friendly error messages
        if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message?.includes('not confirmed') || 
                   error.message?.includes('confirmation') ||
                   error.message?.includes('check your email')) {
          setError('Please confirm your email address first. Check your inbox and spam folder for the confirmation link.');
          setShowResend(true);
        } else {
          setError(error.message || 'Sign in failed. Please try again.');
        }
      } else {
        console.log('Sign in successful');
        setMessage('Welcome back! 🎉');
        // Clear sensitive form data
        setPassword('');
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.functions.invoke('send-reset-email', {
        body: { email: forgotPasswordEmail, origin: window.location.origin }
      });

      if (error) {
        setError(error.message || 'Failed to send password reset email');
      } else {
        setMessage('Password reset email sent! Please check your inbox and spam folder.');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }
    } catch (err: any) {
      setError('Failed to send password reset email. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Welcome to PeopleBook.ai</h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Join our AI-powered people directory</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-peoplebook-text">Get Started</CardTitle>
              <CardDescription className="text-center">
                Create your account or sign in to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-peoplebook-purple/10 data-[state=active]:to-peoplebook-blue/10">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-peoplebook-purple/10 data-[state=active]:to-peoplebook-blue/10">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error || validationErrors.length > 0) {
                              setError('');
                              setValidationErrors([]);
                            }
                          }}
                          className="pl-10"
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error || validationErrors.length > 0) {
                              setError('');
                              setValidationErrors([]);
                            }
                          }}
                          className="pl-10 pr-12"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-700">
                          <ul className="list-disc list-inside space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Server Error */}
                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Success Message */}
                    {message && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-700">{message}</AlertDescription>
                      </Alert>
                    )}

                    {/* Resend Confirmation */}
                    {showResend && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <AlertDescription className="text-blue-700">
                          <div className="space-y-2">
                            <p>Need to confirm your email?</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleResendConfirmation}
                              disabled={loading}
                              className="text-blue-600 border-blue-300 hover:bg-blue-100"
                            >
                              {loading ? 'Sending...' : 'Resend Confirmation Email'}
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90 transition-all duration-300"
                      disabled={loading || attemptCount >= 10}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : attemptCount >= 10 ? (
                        'Too Many Attempts'
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Sign In Securely
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotPasswordEmail(email);
                          setError('');
                          setValidationErrors([]);
                        }}
                        className="text-sm text-peoplebook-blue hover:text-peoplebook-purple transition-colors"
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  </form>

                  {showForgotPassword && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-700 mb-3">Reset Password</h4>
                      <form onSubmit={handleForgotPassword} className="space-y-3">
                        <div>
                          <Label htmlFor="forgot-email">Email Address</Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                          >
                            {loading ? 'Sending...' : 'Send Reset Email'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForgotPassword(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-peoplebook-purple/10 to-peoplebook-blue/10 rounded-full mb-4">
                          <span className="text-sm font-medium text-peoplebook-purple">Step 1</span>
                        </div>
                        <h3 className="text-2xl font-bold text-peoplebook-text mb-2">Create Your Profile</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Begin by signing up and creating your profile on Peoplebook.ai. Select your role as a Consumer (seeking knowledge), Producer (sharing expertise), or Ad-Hoc (facilitating connections).
                        </p>
                      </div>

                      <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        // Validate Step 1 before proceeding
                        const validation = validateSignUpForm({ name, email, password, confirmPassword });
                        if (!validation.isValid) {
                          setValidationErrors(validation.errors);
                          return;
                        }
                        setValidationErrors([]);
                        setCurrentStep(2); 
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                if (validationErrors.length > 0) {
                                  setValidationErrors([]);
                                }
                              }}
                              className="pl-10"
                              autoComplete="name"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                if (validationErrors.length > 0) {
                                  setValidationErrors([]);
                                }
                              }}
                              className="pl-10"
                              autoComplete="email"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="signup-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a secure password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                if (validationErrors.length > 0) {
                                  setValidationErrors([]);
                                }
                              }}
                              className="pl-10 pr-12"
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          
                          {/* Password Strength Indicator */}
                          {password && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Password strength:</span>
                                <span className={getPasswordStrength(password).color}>
                                  {getPasswordStrength(password).label}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    getPasswordStrength(password).score <= 1 ? 'bg-red-500' :
                                    getPasswordStrength(password).score <= 2 ? 'bg-orange-500' :
                                    getPasswordStrength(password).score <= 3 ? 'bg-yellow-500' :
                                    getPasswordStrength(password).score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${(getPasswordStrength(password).score / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (validationErrors.length > 0) {
                                  setValidationErrors([]);
                                }
                              }}
                              className="pl-10 pr-12"
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Validation Errors */}
                        {validationErrors.length > 0 && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">
                              <ul className="list-disc list-inside space-y-1">
                                {validationErrors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Server Error */}
                        {error && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                          </Alert>
                        )}

                        {/* Success Message */}
                        {message && (
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-700">{message}</AlertDescription>
                          </Alert>
                        )}

                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90"
                          disabled={!name || !email || !password || !confirmPassword || getPasswordStrength(password).score < 3 || attemptCount >= 5}
                        >
                          Continue to Role Selection
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </form>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-peoplebook-purple/10 to-peoplebook-blue/10 rounded-full mb-4">
                          <span className="text-sm font-medium text-peoplebook-purple">Step 2</span>
                        </div>
                        <h3 className="text-2xl font-bold text-peoplebook-text mb-2">Select Your Role</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Choose how you want to participate in our AI-powered ecosystem
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-4">
                          {roles.map((role) => {
                            const IconComponent = role.icon;
                            const isSelected = selectedRole === role.id;
                            
                            return (
                              <div
                                key={role.id}
                                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? 'border-peoplebook-blue bg-gradient-to-r from-peoplebook-blue/5 to-peoplebook-purple/5'
                                    : 'border-slate-200 hover:border-peoplebook-blue/50'
                                }`}
                                onClick={() => setSelectedRole(role.id)}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center flex-shrink-0`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center">
                                      <h4 className="text-lg font-semibold text-peoplebook-text">{role.title}</h4>
                                      {isSelected && (
                                        <CheckCircle className="w-5 h-5 text-peoplebook-blue ml-2" />
                                      )}
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                      {role.description}
                                    </p>
                                  </div>
                                </div>
                                <input
                                  type="radio"
                                  name="role"
                                  value={role.id}
                                  checked={selectedRole === role.id}
                                  onChange={(e) => setSelectedRole(e.target.value as AppRole)}
                                  className="absolute top-4 right-4"
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div className="space-y-3 mt-6 p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <ArrowRight className="w-4 h-4 text-peoplebook-blue" />
                            <span>Specify your category (individual, group/community, or corporate)</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <ArrowRight className="w-4 h-4 text-peoplebook-blue" />
                            <span>Define your interests, needs, or areas of expertise</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <ArrowRight className="w-4 h-4 text-peoplebook-blue" />
                            <span>Set your availability and preferred collaboration timeframes</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={handleSignUp}
                          className="flex-1 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Profile...
                            </>
                          ) : (
                            'Create Your Profile'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Security Features */}
              <SecurityIndicator />
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;