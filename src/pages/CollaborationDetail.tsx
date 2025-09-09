import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, Target, MessageCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

const CollaborationDetail = () => {
  const { id } = useParams();

  // Mock data - in real app, this would be fetched based on ID
  const collaboration = {
    id: id,
    title: "Community Garden Development",
    description: "Developing sustainable community gardens in urban areas to promote food security, environmental awareness, and community building.",
    category: "Community",
    status: "Active",
    progress: 75,
    dueDate: "June 30, 2025",
    createdDate: "March 15, 2025",
    collaborators: [
      { name: "John Doe", role: "Consumer" as const, avatar: "" },
      { name: "Jane Smith", role: "Producer" as const, avatar: "" },
      { name: "Mike Johnson", role: "Ad-Hoc" as const, avatar: "" }
    ],
    milestones: [
      { title: "Site Assessment", completed: true, dueDate: "March 20, 2025" },
      { title: "Community Consultation", completed: true, dueDate: "April 5, 2025" },
      { title: "Resource Planning", completed: false, dueDate: "May 1, 2025" },
      { title: "Implementation", completed: false, dueDate: "June 15, 2025" }
    ],
    objectives: [
      "Create 5 community garden plots",
      "Train 20 community members in sustainable gardening",
      "Establish a seed sharing program",
      "Develop a maintenance schedule"
    ]
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-peoplebook-text mb-2">{collaboration.title}</h1>
                  <div className="flex items-center space-x-4 text-slate-600">
                    <Badge variant="secondary">{collaboration.category}</Badge>
                    <Badge className="bg-green-100 text-green-800">{collaboration.status}</Badge>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {collaboration.dueDate}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                  <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue">
                    Update Progress
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-6">{collaboration.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-slate-600">{collaboration.progress}%</span>
                      </div>
                      <Progress value={collaboration.progress} className="w-full" />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Project Objectives
                      </h4>
                      <ul className="space-y-2">
                        {collaboration.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-peoplebook-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-600">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {collaboration.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.completed 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {milestone.completed ? '✓' : index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              milestone.completed ? 'text-green-600' : 'text-slate-900'
                            }`}>
                              {milestone.title}
                            </h4>
                            <p className="text-sm text-slate-500">Due: {milestone.dueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Collaborators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Collaborators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {collaboration.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-peoplebook-blue/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-peoplebook-blue">
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{collaborator.name}</p>
                            <p className="text-sm text-slate-500">{collaborator.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Created</p>
                      <p className="text-slate-900">{collaboration.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Category</p>
                      <p className="text-slate-900">{collaboration.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Status</p>
                      <Badge className="bg-green-100 text-green-800">{collaboration.status}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="w-full">
                      Share Collaboration
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CollaborationDetail;