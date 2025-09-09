import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AuthDebug = () => {
  const { user, session, loading } = useAuth();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800">🐛 Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2 text-orange-700">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? user.email : 'null'}</div>
        <div><strong>Session:</strong> {session ? 'exists' : 'null'}</div>
        <div><strong>User ID:</strong> {user?.id || 'null'}</div>
        <div><strong>Email Confirmed:</strong> {user?.email_confirmed_at ? 'yes' : 'no'}</div>
        <div><strong>Roles:</strong> {user?.roles?.join(', ') || 'none'}</div>
        <div><strong>Current URL:</strong> {window.location.href}</div>
      </CardContent>
    </Card>
  );
};