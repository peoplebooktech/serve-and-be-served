import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, MapPin, Briefcase, Mail, Edit2, Trash2, Loader2, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Profile {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  skills: string[];
  image_url: string;
  created_at: string;
  updated_at: string;
}

const Profiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all-companies");
  const [skillFilter, setSkillFilter] = useState("all-skills");
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, companyFilter, skillFilter]);

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-peoplebook-blue" />
          <span className="text-lg text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase.rpc('get_public_profiles');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function filterProfiles() {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (companyFilter && companyFilter !== "all-companies") {
      filtered = filtered.filter(profile =>
        profile.company?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (skillFilter && skillFilter !== "all-skills") {
      filtered = filtered.filter(profile =>
        profile.skills?.some(skill =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    setFilteredProfiles(filtered);
  }

  const handleDelete = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete profiles.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this profile?")) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully!",
      });

      fetchProfiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  const getUniqueCompanies = () => {
    const companies = profiles
      .map(p => p.company)
      .filter(company => company && company.trim() !== "")
      .filter((company, index, arr) => arr.indexOf(company) === index);
    return companies.sort();
  };

  const getUniqueSkills = () => {
    const allSkills = profiles
      .flatMap(p => p.skills || [])
      .filter(skill => skill && skill.trim() !== "")
      .filter((skill, index, arr) => arr.indexOf(skill) === index);
    return allSkills.sort();
  };

  const getSuggestedCompanies = () => {
    return [
      "Microsoft",
      "Google",
      "Apple", 
      "Amazon",
      "Meta",
      "Netflix",
      "Tesla",
      "OpenAI",
      "Anthropic",
      "Stripe",
      "Airbnb",
      "Uber",
      "Spotify",
      "Adobe",
      "Salesforce",
      "IBM",
      "Oracle",
      "NVIDIA",
      "Intel",
      "Cisco"
    ];
  };

  const getSuggestedSkills = () => {
    return [
      "JavaScript",
      "TypeScript", 
      "React",
      "Node.js",
      "Python",
      "Java",
      "C++",
      "Go",
      "Rust",
      "Swift",
      "Machine Learning",
      "Data Science",
      "AI/ML",
      "Cloud Computing",
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "DevOps",
      "Product Management",
      "UI/UX Design",
      "Marketing",
      "Sales",
      "Leadership",
      "Project Management"
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-peoplebook-blue" />
            <span className="text-lg text-slate-600">Loading profiles...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-peoplebook-text mb-2">People Directory</h1>
            <p className="text-slate-600">Discover and connect with amazing people in our community</p>
          </div>
          {user && (
            <Link to="/profiles/add">
              <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-companies">All companies</SelectItem>
                
                {/* Existing companies from profiles */}
                {getUniqueCompanies().length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-slate-500 border-b">
                      Current Companies
                    </div>
                    {getUniqueCompanies()
                      .filter(company => company && company.trim() !== "")
                      .map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {/* Suggested companies */}
                <div className="px-2 py-1 text-xs font-medium text-slate-500 border-b">
                  Suggested Companies
                </div>
                {getSuggestedCompanies().map((company) => (
                  <SelectItem key={`suggested-${company}`} value={company}>
                    <div className="flex items-center">
                      <span>{company}</span>
                      <Badge variant="outline" className="ml-2 text-xs">Popular</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-skills">All skills</SelectItem>
                
                {/* Existing skills from profiles */}
                {getUniqueSkills().length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-slate-500 border-b">
                      Current Skills
                    </div>
                    {getUniqueSkills()
                      .filter(skill => skill && skill.trim() !== "")
                      .map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {/* Suggested skills */}
                <div className="px-2 py-1 text-xs font-medium text-slate-500 border-b">
                  Suggested Skills
                </div>
                {getSuggestedSkills().map((skill) => (
                  <SelectItem key={`suggested-${skill}`} value={skill}>
                    <div className="flex items-center">
                      <span>{skill}</span>
                      <Badge variant="outline" className="ml-2 text-xs">Popular</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing {filteredProfiles.length} of {profiles.length} profiles
          </p>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {profile.image_url ? (
                        <img
                          src={profile.image_url}
                          alt={profile.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-peoplebook-text">{profile.name}</h3>
                        {profile.title && (
                          <p className="text-sm text-slate-600">{profile.title}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {profile.company && (
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {profile.company}
                    </div>
                  )}

                  {profile.bio && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {profile.bio}
                    </p>
                  )}

                  {profile.skills && profile.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link to={`/profiles/${profile.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    {user && (
                      <>
                        <Link to={`/profiles/${profile.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(profile.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative max-w-4xl mx-auto text-center">
              <div className="mb-8">
                {/* Floating Elements */}
                <div className="relative inline-block">
                  <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-r from-peoplebook-purple/20 to-peoplebook-blue/20 animate-pulse"></div>
                  <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-r from-peoplebook-blue/20 to-peoplebook-green/20 animate-pulse" style={{ animationDelay: "1s" }}></div>
                  
                  {/* Main Icon Container */}
                  <div className="relative z-10 w-32 h-32 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    {searchTerm || companyFilter || skillFilter ? (
                      <Search className="w-16 h-16 text-white" />
                    ) : (
                      <Users className="w-16 h-16 text-white" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-peoplebook-purple/10 to-peoplebook-blue/10 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-peoplebook-purple mr-2" />
                  <span className="text-sm font-medium text-peoplebook-purple">
                    {searchTerm || companyFilter || skillFilter ? "No Matches Found" : "Start Building Community"}
                  </span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-bold mb-6 text-peoplebook-text">
                  {searchTerm || companyFilter || skillFilter ? (
                    <>No <span className="gradient-text">Profiles</span> Match</>
                  ) : (
                    <>Be the <span className="gradient-text">First</span> to Join</>
                  )}
                </h3>
                
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                  {searchTerm || companyFilter || skillFilter
                    ? "Try adjusting your search filters or exploring different criteria to find the perfect matches in our community."
                    : "Start building our people directory by adding your profile. Connect with AI-matched mentors, experts, and communities to co-create and co-grow together."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {user && (
                  <Link to="/profiles/add">
                    <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                      <Plus className="w-5 h-5 mr-2" />
                      {searchTerm || companyFilter || skillFilter ? "Add Your Profile" : "Add First Profile"}
                    </Button>
                  </Link>
                )}
                
                {(searchTerm || companyFilter || skillFilter) && (
                  <Button 
                    variant="outline" 
                    className="border-2 border-peoplebook-blue text-peoplebook-blue hover:bg-peoplebook-blue hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
                    onClick={() => {
                      setSearchTerm("");
                      setCompanyFilter("all-companies");
                      setSkillFilter("all-skills");
                    }}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Trust Indicators for Empty State */}
              {!searchTerm && !companyFilter && !skillFilter && (
                <div className="mt-16 flex items-center justify-center space-x-12">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-peoplebook-blue">AI-Powered</div>
                    <div className="text-sm text-slate-600">Smart Matching</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-peoplebook-purple">4 Verticals</div>
                    <div className="text-sm text-slate-600">Key Focus Areas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-peoplebook-green">Secure</div>
                    <div className="text-sm text-slate-600">Privacy First</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profiles;