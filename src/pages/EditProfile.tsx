import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProfileForm {
  name: string;
  title: string;
  company: string;
  bio: string;
  contact_info: string;
  skills: string;
  image_url: string;
}

const EditProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ProfileForm>({
    name: "",
    title: "",
    company: "",
    bio: "",
    contact_info: "",
    skills: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_public_profile_by_id', { profile_id: profileId });

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Profile not found');
      }

      const profile = data[0];
      
      // Only allow editing own profile
      if (!profile.is_own_profile) {
        throw new Error('Unauthorized to edit this profile');
      }

      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        company: profile.company || "",
        bio: profile.bio || "",
        contact_info: profile.contact_info || "",
        skills: (profile.skills || []).join(", "),
        image_url: profile.image_url || "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile details",
        variant: "destructive",
      });
      navigate('/profiles');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (formData.contact_info && formData.contact_info.includes('@') && !formData.contact_info.includes('.')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim(),
          title: formData.title.trim() || null,
          company: formData.company.trim() || null,
          bio: formData.bio.trim() || null,
          contact_info: formData.contact_info.trim() || null,
          skills: skillsArray,
          image_url: formData.image_url.trim() || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      navigate(`/profiles/${id}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to={`/profiles/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
            
            <h1 className="text-4xl font-bold text-foreground mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update profile information
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit2 className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name - Required */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="e.g., TechCorp Inc"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <Label htmlFor="contact_info" className="text-sm font-medium">
                    Contact Information
                  </Label>
                  <Input
                    id="contact_info"
                    type="text"
                    placeholder="Email address, LinkedIn, or website"
                    value={formData.contact_info}
                    onChange={(e) => handleInputChange('contact_info', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide your email, LinkedIn profile, or website URL
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-sm font-medium">
                    Skills
                  </Label>
                  <Input
                    id="skills"
                    type="text"
                    placeholder="React, Node.js, TypeScript, Project Management"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate skills with commas
                  </p>
                </div>

                {/* Profile Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-sm font-medium">
                    Profile Image URL
                  </Label>
                  <Input
                    id="image_url"
                    type="url"
                    placeholder="https://example.com/profile-image.jpg"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Link to your profile image
                  </p>
                </div>

                {/* Image Preview */}
                {formData.image_url && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preview</Label>
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                      <img
                        src={formData.image_url}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Link to={`/profiles/${id}`}>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;