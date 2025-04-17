
import { BrainCircuit, Users, Lightbulb, BarChart3, HandHeart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleCard from "@/components/RoleCard";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-peoplebook-text">
                Serve and Be Served
              </h1>
              <p className="text-xl mb-8 text-slate-600">
                Connect with mentors, peers, and communities to co-create, co-grow, and 
                co-experience in a platform designed to reduce inequality through non-formal education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-peoplebook-blue hover:bg-peoplebook-blue/90 text-white px-8 py-6">
                  Get Started
                </Button>
                <Button variant="outline" className="border-peoplebook-blue text-peoplebook-blue hover:bg-slate-50 px-8 py-6">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-blue-100 opacity-60"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-slate-100 opacity-60"></div>
                <div className="absolute top-1/2 -right-4 w-12 h-12 rounded-full bg-indigo-100 opacity-60"></div>
                <div className="relative z-10 bg-white p-4 rounded-2xl shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                    alt="Collaboration" 
                    className="rounded-xl w-full h-auto max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-header">Find Your Role</h2>
            <p className="section-description">
              Peoplebook.ai connects people across different roles to create meaningful 
              collaborations and foster non-formal education opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <RoleCard 
              title="Consumer"
              description="Individuals, communities, or organizations seeking knowledge and growth"
              icon={<GraduationCap className="w-8 h-8" />}
              bgColor="border-slate-100"
              btnText="Join as Consumer"
            />
            
            <RoleCard 
              title="Producer"
              description="Share your expertise and guide others through their learning journey"
              icon={<Lightbulb className="w-8 h-8" />}
              bgColor="border-slate-100"
              btnText="Join as Producer"
            />
            
            <RoleCard 
              title="Ad-Hoc"
              description="Represent others and facilitate connections between consumers and producers"
              icon={<HandHeart className="w-8 h-8" />}
              bgColor="border-slate-100"
              btnText="Join as Ad-Hoc"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-header">How Peoplebook.ai Works</h2>
            <p className="section-description">
              Our platform matches consumers with the right producers based on specific needs, contexts, and availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="text-peoplebook-blue w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-peoplebook-text">Create Your Profile</h3>
                <p className="text-slate-600">
                  Register and set up your profile, identifying your role and specific interests or expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                  <BrainCircuit className="text-peoplebook-blue w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-peoplebook-text">Get Matched</h3>
                <p className="text-slate-600">
                  Our system identifies the top 5 matches based on your specific needs and context.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm hover:shadow transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="text-peoplebook-blue w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-peoplebook-text">Track Progress</h3>
                <p className="text-slate-600">
                  Follow your collaboration journey with milestones and progress tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-header">Success Stories</h2>
            <p className="section-description">
              See how Peoplebook.ai has helped people connect, learn, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="testimonial-gradient border-none shadow-sm p-6">
              <CardContent className="pt-0">
                <p className="italic text-slate-600 mb-4">
                  "Peoplebook.ai connected me with a mentor who truly understood my needs. The structured 
                  collaboration helped me achieve my goals in ways I never thought possible."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
                  <div>
                    <p className="font-semibold text-peoplebook-text">Sarah Johnson</p>
                    <p className="text-sm text-slate-500">Consumer, Education Sector</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-gradient border-none shadow-sm p-6">
              <CardContent className="pt-0">
                <p className="italic text-slate-600 mb-4">
                  "As a producer, I've been able to share my expertise with those who truly need it. 
                  The platform makes it easy to track progress and celebrate achievements."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
                  <div>
                    <p className="font-semibold text-peoplebook-text">Michael Chen</p>
                    <p className="text-sm text-slate-500">Producer, Technology Mentor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="md:flex items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-peoplebook-text">Ready to Transform Education?</h2>
                <p className="text-slate-600 max-w-xl">
                  Join Peoplebook.ai today to be part of a revolutionary approach to non-formal education, 
                  mentoring, and societal growth.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-peoplebook-blue hover:bg-peoplebook-blue/90 text-white px-8 py-6">
                  Sign Up Now
                </Button>
                <Link to="/how-it-works">
                  <Button variant="outline" className="border-peoplebook-blue text-peoplebook-blue hover:bg-slate-50 px-8 py-6 w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
