import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const EmailConfirm = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') ?? '/profiles';

      console.log('Email confirmation params:', { token_hash, type, next });

      if (token_hash && type) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('Email confirmation error:', error);
            throw error;
          }

          console.log('Email confirmation successful:', data);
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to your profile...');
          
          toast({
            title: 'Success',
            description: 'Email confirmed successfully!',
          });

          // Redirect after a short delay
          setTimeout(() => {
            navigate(next, { replace: true });
          }, 3000);

        } catch (error: any) {
          console.error('Email confirmation failed:', error);
          setStatus('error');
          setMessage(error.message || 'Email confirmation failed. The link may be invalid or expired.');
          
          toast({
            title: 'Error',
            description: 'Email confirmation failed. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        setStatus('error');
        setMessage('Invalid confirmation link. Missing required parameters.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-peoplebook-text">
              Email Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-peoplebook-blue" />
                </div>
                <p className="text-slate-600">Confirming your email...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-green-600 font-medium">{message}</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <p className="text-red-600">{message}</p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="w-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90"
                  >
                    Back to Sign In
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/profiles')}
                    className="w-full"
                  >
                    Go to Profiles
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default EmailConfirm;