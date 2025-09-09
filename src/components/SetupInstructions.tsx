import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Settings, Mail, CheckCircle } from "lucide-react";

const SetupInstructions = () => {
  return (
    <Card className="mt-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-900">
          <Settings className="w-5 h-5 mr-2" />
          One-Time Setup Required
        </CardTitle>
        <CardDescription className="text-blue-700">
          To enable instant sign-up without email confirmation, please update your Supabase settings:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <div>
              <p className="text-blue-900 font-medium">Go to Supabase Dashboard</p>
              <p className="text-blue-700 text-sm">Open your Supabase project dashboard</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => window.open('https://supabase.com/dashboard/project/wahevfagmtqklbhjgoyv/auth/settings', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open Auth Settings
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <div>
              <p className="text-blue-900 font-medium">Navigate to Authentication Settings</p>
              <p className="text-blue-700 text-sm">Go to Authentication → Settings in your Supabase dashboard</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <div>
              <p className="text-blue-900 font-medium">Disable Email Confirmation</p>
              <p className="text-blue-700 text-sm">Turn OFF "Enable email confirmations" option</p>
              <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                <Mail className="w-3 h-3 inline mr-1" />
                Look for: "Enable email confirmations" toggle and turn it OFF
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-blue-900 font-medium">Save Changes</p>
              <p className="text-blue-700 text-sm">Click Save to apply the changes</p>
            </div>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            <div className="space-y-2">
              <p><strong>Note:</strong> After disabling email confirmation, users will be able to sign up and sign in immediately without needing to verify their email address.</p>
              <p><strong>Password Reset:</strong> The "Forgot Password" feature is enabled and will send reset links to users' email addresses.</p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SetupInstructions;