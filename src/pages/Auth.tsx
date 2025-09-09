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
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  Lightbulb, 
  HandHeart,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('consumer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const { signUp, signIn, resendConfirmation, user } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user) {
      navigate('/profiles');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    console.log('Form submitted for signup');

    try {
      const { error } = await signUp(email, password, name, selectedRole);

      if (error) {
        console.error('Signup form error:', error);
        setError(error.message || 'An error occurred during signup');
      } else {
        setMessage('Account created successfully! 📧 We\'ve sent a confirmation email to ' + email + '. Please check your inbox (and spam folder) and click the confirmation link to activate your account. The link expires in 24 hours.');
        setShowResend(true);
        // Don't clear the email field so user can resend confirmation
        setPassword('');
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
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setShowResend(false);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Signin form error:', error);
        setError(error.message || 'An error occurred during signin');
        
        // Show resend button for confirmation-related errors
        if (error.message && (
          error.message.includes('not confirmed') || 
          error.message.includes('confirmation') ||
          error.message.includes('check your email')
        )) {
          setShowResend(true);
        }
      } else {
        navigate('/profiles');
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
        body: { email: forgotPasswordEmail }
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
      
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">Welcome to PeopleBook.ai</h1>
            <p className="text-slate-600 mt-2">Join our AI-powered people directory</p>
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <Button
                        variant="link"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotPasswordEmail(email);
                        }}
                        className="text-sm text-peoplebook-blue hover:text-peoplebook-purple"
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

                      <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Create a password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90"
                          disabled={!name || !email || !password}
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

              {error && (
                <Alert className="mt-4 border-destructive">
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                  {showResend && (
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleResendConfirmation}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Resend Confirmation Email'
                        )}
                      </Button>
                    </div>
                  )}
                </Alert>
              )}

              {message && (
                <Alert className="mt-4 border-green-500">
                  <AlertDescription className="text-green-600">{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;