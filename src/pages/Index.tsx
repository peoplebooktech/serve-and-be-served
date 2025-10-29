
import { BrainCircuit, Users, Lightbulb, BarChart3, HandHeart, GraduationCap, BookOpen, Stethoscope, Leaf, Trophy, Sparkles, Network, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleCard from "@/components/RoleCard";
import VerticalCard from "@/components/VerticalCard";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-peoplebook-purple/10 to-peoplebook-blue/10 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-peoplebook-purple mr-2" />
                <span className="text-sm font-medium text-peoplebook-purple">AI-Powered Matching Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="gradient-text">Serve and</span><br />
                <span className="text-peoplebook-text">Be Served</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-slate-600 leading-relaxed">
                Connect with AI-matched mentors, experts, and communities to co-create, 
                co-grow, and co-experience in Education, Healthcare, Agriculture, and Sports.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/profiles">
                  <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:from-peoplebook-purple/90 hover:to-peoplebook-blue/90 text-white px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                    <BrainCircuit className="w-5 h-5 mr-2" />
                    Explore Profiles
                  </Button>
                </Link>
                <Link to="/profiles/add">
                  <Button variant="outline" className="border-2 border-peoplebook-blue text-peoplebook-blue hover:bg-peoplebook-blue hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300">
                    <Network className="w-5 h-5 mr-2" />
                    Add Your Profile
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-12 flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-peoplebook-blue">10K+</div>
                  <div className="text-sm text-slate-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-peoplebook-purple">95%</div>
                  <div className="text-sm text-slate-600">Match Success</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-peoplebook-green">4</div>
                  <div className="text-sm text-slate-600">Key Verticals</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-16 lg:mt-0 flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="mb-4 text-center">
                <span className="text-lg font-bold text-peoplebook-text">An IIT Incubated Enterprise</span>
              </div>
              <div className="relative">
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-r from-peoplebook-purple/20 to-peoplebook-blue/20 animate-pulse"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-r from-peoplebook-blue/20 to-peoplebook-green/20 animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute top-1/3 -right-6 w-16 h-16 rounded-full bg-gradient-to-r from-peoplebook-green/20 to-peoplebook-yellow/20 animate-pulse" style={{ animationDelay: "2s" }}></div>
                
                {/* Main Image Container */}
                <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                    alt="AI-Powered Collaboration" 
                    className="rounded-2xl w-full h-auto max-w-lg"
                  />
                  
                  {/* Floating AI Indicators */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue p-3 rounded-full shadow-lg">
                    <BrainCircuit className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-peoplebook-blue to-peoplebook-green p-3 rounded-full shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Matching System Feature */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-peoplebook-blue/10 to-peoplebook-purple/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-peoplebook-blue mr-2" />
              <span className="text-sm font-medium text-peoplebook-blue">Intelligent Matching</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-peoplebook-text">
              AI-Powered <span className="gradient-text">Precision Matching</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our advanced AI analyzes your needs, context, and preferences to connect you with the perfect producers and mentors in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-peoplebook-text">Smart Analysis</h3>
                <p className="text-slate-600">
                  AI analyzes your request, location, and societal context for optimal matching
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-peoplebook-blue to-peoplebook-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-peoplebook-text">Top 5 Matches</h3>
                <p className="text-slate-600">
                  Get precisely ranked top 5 producers based on expertise and availability
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-peoplebook-green to-peoplebook-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-peoplebook-text">AI Fallback</h3>
                <p className="text-slate-600">
                  Advanced AI producers available 24/7 when human experts are unavailable
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Verticals Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-peoplebook-green/10 to-peoplebook-blue/10 rounded-full mb-6">
              <Network className="w-4 h-4 text-peoplebook-blue mr-2" />
              <span className="text-sm font-medium text-peoplebook-blue">Four Key Verticals</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-peoplebook-text">
              Where <span className="gradient-text">Impact Meets Innovation</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Peoplebook.ai focuses on four transformative verticals where AI-powered collaboration creates maximum societal impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <VerticalCard 
              title="Education"
              description="Transforming learning through AI-matched peer mentorship and expert guidance"
              icon={<BookOpen className="w-8 h-8" />}
              bgColor="bg-gradient-to-br from-indigo-50 to-purple-50"
              textColor="text-peoplebook-education"
              linkTo="/education"
            />
            
            <VerticalCard 
              title="Healthcare"
              description="Connecting patients with healthcare experts through intelligent matching"
              icon={<Stethoscope className="w-8 h-8" />}
              bgColor="bg-gradient-to-br from-cyan-50 to-blue-50"
              textColor="text-peoplebook-healthcare"
              linkTo="/healthcare"
            />
            
            <VerticalCard 
              title="Agriculture"
              description="Empowering farmers with AI-connected agricultural expertise and innovation"
              icon={<Leaf className="w-8 h-8" />}
              bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
              textColor="text-peoplebook-agriculture"
              linkTo="/agriculture"
            />
            
            <VerticalCard 
              title="Sports"
              description="Building athletic excellence through AI-powered coaching connections"
              icon={<Trophy className="w-8 h-8" />}
              bgColor="bg-gradient-to-br from-amber-50 to-orange-50"
              textColor="text-peoplebook-sports"
              linkTo="/sports"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Roles Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-peoplebook-text">
              Choose Your <span className="gradient-text">Role</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join our AI-powered ecosystem where every participant contributes to reducing inequality and fostering growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard 
              title="Consumer"
              description="Individuals, communities, or organizations seeking AI-matched expertise and knowledge"
              icon={<GraduationCap className="w-8 h-8" />}
              bgColor="border-gradient-purple"
              btnText="Become a Consumer"
              onClick={() => navigate('/profiles/add')}
            />
            
            <RoleCard 
              title="Producer"
              description="Share your expertise through our AI-powered platform and guide others to success"
              icon={<Lightbulb className="w-8 h-8" />}
              bgColor="border-gradient-blue"
              btnText="Become a Producer"
              onClick={() => navigate('/profiles/add')}
            />
            
            <RoleCard 
              title="Ad-Hoc"
              description="Represent and facilitate AI-enhanced connections between consumers and producers"
              icon={<HandHeart className="w-8 h-8" />}
              bgColor="border-gradient-green"
              btnText="Join as Ad-Hoc"
              onClick={() => navigate('/profiles/add')}
            />
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-peoplebook-text">
              How <span className="gradient-text">Peoplebook.ai</span> Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our intelligent platform creates meaningful connections through advanced AI matching and collaborative roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-white to-blue-50 border-none shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-peoplebook-blue to-peoplebook-purple rounded-full flex items-center justify-center mb-6">
                  <Users className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-peoplebook-text">Create Your Profile</h3>
                <p className="text-slate-600 text-lg">
                  Register and set up your intelligent profile with AI-enhanced categorization by role, expertise, and societal context.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50 border-none shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue rounded-full flex items-center justify-center mb-6">
                  <BrainCircuit className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-peoplebook-text">AI-Powered Matching</h3>
                <p className="text-slate-600 text-lg">
                  Our advanced AI analyzes your specific needs and context to identify the top 5 most relevant matches instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50 border-none shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-r from-peoplebook-green to-peoplebook-blue rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-peoplebook-text">Collaborative Growth</h3>
                <p className="text-slate-600 text-lg">
                  Follow structured roadmaps with milestones, track progress, and achieve goals through intelligent collaboration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-peoplebook-purple via-peoplebook-blue to-peoplebook-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform the Future?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
              Join Peoplebook.ai today and be part of the AI revolution in mentoring, collaboration, and societal growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/profiles">
                <Button className="bg-white text-peoplebook-purple hover:bg-white/90 px-12 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Browse Profiles
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-peoplebook-purple px-12 py-6 text-lg rounded-full transition-all duration-300">
                  <Network className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
