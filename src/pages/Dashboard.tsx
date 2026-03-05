
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Filter, BarChart3, ListFilter, Sparkles, Users, MapPin, Briefcase, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollaborationCard from "@/components/CollaborationCard";
import MilestoneTracker from "@/components/MilestoneTracker";
import RecommendationCard from "@/components/RecommendationCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useOpportunityMatching } from "@/hooks/useOpportunityMatching";
import { useApplications } from "@/hooks/useApplications";

// Mock data
const collaborations = [
  {
    id: "1",
    title: "Community Garden Development",
    description: "Developing sustainable community gardens in urban areas",
    category: "Community",
    collaborators: [
      { name: "John Doe", role: "Consumer" as const },
      { name: "Jane Smith", role: "Producer" as const }
    ],
    progress: 75,
    dueDate: "June 30, 2025"
  },
  {
    id: "2",
    title: "Digital Literacy for Seniors",
    description: "Teaching digital skills to elderly community members",
    category: "Education",
    collaborators: [
      { name: "Village Council", role: "Consumer" as const },
      { name: "Tech Solutions Inc", role: "Producer" as const }
    ],
    progress: 45,
    dueDate: "August 15, 2025"
  },
  {
    id: "3",
    title: "Youth Entrepreneurship Program",
    description: "Mentoring young entrepreneurs in rural communities",
    category: "Business",
    collaborators: [
      { name: "Rural Youth Group", role: "Consumer" as const },
      { name: "Business Leaders Association", role: "Producer" as const },
      { name: "Michael Brown", role: "Ad-Hoc" as const }
    ],
    progress: 30,
    dueDate: "September 5, 2025"
  }
];

const activeMilestones = [
  {
    title: "Initial Assessment",
    description: "Evaluate current status and define specific goals",
    completed: true
  },
  {
    title: "Implementation Planning",
    description: "Create action plan with resource allocation",
    completed: true
  },
  {
    title: "Progress Review",
    description: "Analyze implementation and adjust strategies",
    completed: false
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { matches: opportunityMatches, loading: matchesLoading, fetchMatches } = useOpportunityMatching();
  const { getMyApplications } = useApplications();

  const fetchAIRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.log('No profile found for recommendations');
        return;
      }

      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          userId: user.id,
          userSkills: profile.skills || [],
          userRole: 'Consumer', // You might want to get this from user data
          userBio: profile.bio || ''
        }
      });

      if (error) throw error;
      if (data?.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      toast({
        title: "Note",
        description: "AI recommendations are loading in the background.",
        variant: "default",
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Load recommendations and matches when component mounts
  useEffect(() => {
    fetchAIRecommendations();
    fetchMatches();
    getMyApplications();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back! Here's your collaboration overview.</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex gap-2"
                onClick={() => setActiveTab("active")}
              >
                <Filter className="h-4 w-4" /> Filter
              </Button>
                  <Link to="/profiles/add">
                    <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90 flex gap-2">
                      <PlusCircle className="h-4 w-4" /> New Post
                    </Button>
                  </Link>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
              <TabsTrigger value="active" className="px-6">Active</TabsTrigger>
              <TabsTrigger value="pending" className="px-6">Pending</TabsTrigger>
              <TabsTrigger value="completed" className="px-6">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Active Collaborations</CardTitle>
                    <CardDescription>Currently ongoing collaborations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-peoplebook-purple">3</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Completed</CardTitle>
                    <CardDescription>Successfully completed collaborations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-peoplebook-blue">7</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">AI Matches</CardTitle>
                    <CardDescription>Opportunities matched to your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-peoplebook-orange">
                      {matchesLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : opportunityMatches.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                        <CardDescription>Your recent collaborations</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs gap-1">
                        <ListFilter className="h-3 w-3" /> Sort
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {collaborations.map((collab) => (
                          <CollaborationCard
                            key={collab.id}
                            id={collab.id}
                            title={collab.title}
                            description={collab.description}
                            category={collab.category}
                            collaborators={collab.collaborators}
                            progress={collab.progress}
                            dueDate={collab.dueDate}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Your Role</CardTitle>
                        <CardDescription>Current participation status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-peoplebook-lightPurple flex items-center justify-center mr-4">
                            <span className="font-bold text-peoplebook-purple">C</span>
                          </div>
                          <div>
                            <div className="font-medium">Consumer</div>
                            <div className="text-sm text-muted-foreground">Individual</div>
                          </div>
                        </div>
                        <Link to="/profiles/add">
                          <Button variant="outline" size="sm" className="w-full">
                            Edit Profile
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <MilestoneTracker 
                      milestones={activeMilestones} 
                      duration="3 months"
                    />
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Analytics</CardTitle>
                        <CardDescription>Collaboration statistics</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <div className="text-center py-6">
                          <BarChart3 className="h-24 w-24 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Detailed analytics available with premium subscription
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => navigate('/profiles/add')}
                          >
                            Upgrade to Premium
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              {/* AI Opportunity Matches Section */}
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-peoplebook-orange" />
                      Recommended Opportunities
                    </CardTitle>
                    <CardDescription>AI-matched based on your skills, location & preferences</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => fetchMatches()} disabled={matchesLoading}>
                    {matchesLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  {matchesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-3 text-muted-foreground">Finding your best matches...</span>
                    </div>
                  ) : opportunityMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-muted p-6">
                        <Briefcase className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">No matches yet</h3>
                      <p className="mt-2 text-muted-foreground text-center max-w-md">
                        Complete your profile with skills, district, and job preferences to get AI-powered opportunity matches.
                      </p>
                      <Link to="/profiles/add">
                        <Button className="mt-4" variant="outline">Complete Profile</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {opportunityMatches.map((match) => (
                        <div
                          key={match.opportunity_id}
                          className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="relative h-14 w-14">
                              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-muted" strokeWidth="3" />
                                <circle
                                  cx="18" cy="18" r="15.5" fill="none"
                                  className="stroke-peoplebook-purple"
                                  strokeWidth="3"
                                  strokeDasharray={`${match.score} ${100 - match.score}`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                {match.score}%
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{match.title}</h4>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {match.reasons.map((reason, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-normal">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Active Collaborations</CardTitle>
                  <CardDescription>
                    Currently ongoing collaborations and their progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collaborations.map((collab) => (
                      <CollaborationCard
                        key={collab.id}
                        id={collab.id}
                        title={collab.title}
                        description={collab.description}
                        category={collab.category}
                        collaborators={collab.collaborators}
                        progress={collab.progress}
                        dueDate={collab.dueDate}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Collaborations</CardTitle>
                  <CardDescription>
                    Collaborations waiting for acceptance or matching
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-6">
                      <PlusCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No pending collaborations</h3>
                    <p className="mt-2 text-muted-foreground text-center max-w-md">
                      Start a new collaboration or check back later for incoming requests.
                    </p>
                    <Link to="/profiles/add">
                      <Button className="mt-6 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90">
                        Start New Collaboration
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Collaborations</CardTitle>
                  <CardDescription>
                    Successfully completed collaborations and outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-muted p-6">
                      <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No completed collaborations yet</h3>
                    <p className="mt-2 text-muted-foreground text-center max-w-md">
                      Your completed collaborations will appear here. Keep up the good work on your active projects!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
