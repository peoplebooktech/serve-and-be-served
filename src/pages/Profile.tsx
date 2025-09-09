import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Calendar, Edit, Settings } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface UserProfile {
  id: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  contact_info?: string;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Exception fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peoplebook-blue mx-auto mb-4"></div>
              <p className="text-slate-600">Loading profile...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-peoplebook-text mb-2">My Profile</h1>
                <p className="text-slate-600">Manage your profile information and settings</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link to="/settings">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link to={profile ? `/profiles/${profile.id}/edit` : '/profiles/add'}>
                  <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {profile ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Profile Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-peoplebook-text mb-2">{profile.name}</h3>
                        {profile.title && profile.company && (
                          <p className="text-lg text-slate-600 mb-4">
                            {profile.title} at {profile.company}
                          </p>
                        )}
                        {profile.title && !profile.company && (
                          <p className="text-lg text-slate-600 mb-4">{profile.title}</p>
                        )}
                        {!profile.title && profile.company && (
                          <p className="text-lg text-slate-600 mb-4">Works at {profile.company}</p>
                        )}
                      </div>

                      {profile.bio && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">About</h4>
                          <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                        </div>
                      )}

                      {profile.skills && profile.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Skills & Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-peoplebook-blue/10 text-peoplebook-blue"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {profile.contact_info && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Mail className="w-5 h-5 mr-2" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600">{profile.contact_info}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Email</p>
                        <p className="text-slate-900">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Member Since</p>
                        <p className="text-slate-900">{formatDate(profile.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Last Updated</p>
                        <p className="text-slate-900">{formatDate(profile.updated_at)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to="/dashboard">
                        <Button variant="outline" className="w-full">
                          View Dashboard
                        </Button>
                      </Link>
                      <Link to="/profiles">
                        <Button variant="outline" className="w-full">
                          Browse Other Profiles
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button variant="outline" className="w-full">
                          Account Settings
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Profile Found</h3>
                  <p className="text-slate-600 mb-6">
                    It looks like you haven't created a profile yet. Create one to get started with Peoplebook.ai!
                  </p>
                  <Link to="/profiles/add">
                    <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue">
                      Create Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;