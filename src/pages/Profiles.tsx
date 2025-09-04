import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, MapPin, Briefcase, Mail, Edit2, Trash2, Loader2 } from "lucide-react";
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
  const [companyFilter, setCompanyFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, companyFilter, skillFilter]);

  const fetchProfiles = async () => {
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
  };

  const filterProfiles = () => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (companyFilter) {
      filtered = filtered.filter(profile =>
        profile.company?.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (skillFilter) {
      filtered = filtered.filter(profile =>
        profile.skills?.some(skill =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    setFilteredProfiles(filtered);
  };

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
                <SelectItem value="">All companies</SelectItem>
                {getUniqueCompanies().map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All skills</SelectItem>
                {getUniqueSkills().map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
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
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No profiles found</h3>
                <p className="text-slate-500">
                  {searchTerm || companyFilter || skillFilter
                    ? "Try adjusting your search filters"
                    : "Be the first to add a profile to our directory"}
                </p>
              </div>
              {user && (
                <Link to="/profiles/add">
                  <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {searchTerm || companyFilter || skillFilter ? "Add Profile" : "Add First Profile"}
                  </Button>
                </Link>
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