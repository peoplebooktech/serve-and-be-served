
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, BarChart3, ListFilter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CollaborationCard from "@/components/CollaborationCard";
import MilestoneTracker from "@/components/MilestoneTracker";

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
  const navigate = useNavigate();

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
                  <PlusCircle className="h-4 w-4" /> New Collaboration
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
                    <CardTitle className="text-xl">Pending Matches</CardTitle>
                    <CardDescription>Awaiting partner acceptance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-peoplebook-orange">2</div>
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
                        <Link to="/profile">
                          <Button variant="outline" size="sm" className="w-full">
                            View Profile
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
                            onClick={() => navigate('/settings')}
                          >
                            View Settings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
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
