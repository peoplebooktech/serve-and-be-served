
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Users, Heart, Eye, Lightbulb, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About Peoplebook.ai</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to transform non-formal education through innovative 
              collaboration, connecting people across diverse backgrounds to create, learn, 
              and grow together.
            </p>
          </div>

          {/* Vision and Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-peoplebook-lightPurple to-white border-none shadow-md">
              <CardContent className="pt-10 pb-10">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white rounded-full mr-4">
                    <Eye className="h-8 w-8 text-peoplebook-purple" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  A world where everyone has equal access to educational opportunities and can 
                  unleash their full potential through collaborative learning and mentorship.
                </p>
                <ul className="space-y-2">
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Reduced educational inequality across communities</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Higher utilization of human potential and resources</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Increased societal growth and satisfaction</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-peoplebook-green/50 to-white border-none shadow-md">
              <CardContent className="pt-10 pb-10">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white rounded-full mr-4">
                    <Lightbulb className="h-8 w-8 text-peoplebook-darkPurple" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  To create a platform that facilitates meaningful connections between those seeking knowledge 
                  and those willing to share expertise, fostering co-creation and mutual growth.
                </p>
                <ul className="space-y-2">
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Connect consumers and producers of knowledge</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Provide structured collaboration frameworks</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Measure and celebrate educational outcomes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* The Philosophy */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Philosophy</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Peoplebook.ai is built on the philosophy of mutual benefit and societal growth 
                through structured collaboration and mentorship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Non-Formal Education</h3>
                <p className="text-muted-foreground">
                  We believe that learning happens everywhere, not just in traditional educational 
                  settings. Our platform embraces non-formal education as a powerful complement to 
                  conventional learning.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-border flex flex-col items-center text-center">
                <Heart className="h-12 w-12 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Serve and Be Served</h3>
                <p className="text-muted-foreground">
                  Our motto reflects the symbiotic relationship at the heart of Peoplebook.ai. 
                  Everyone has something to contribute and something to gain through mutual service 
                  and collaboration.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-border flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Growth</h3>
                <p className="text-muted-foreground">
                  We're committed to fostering connections that lead to community development and 
                  societal advancement. By working together, we create, capture, and deliver value back 
                  to society.
                </p>
              </div>
            </div>
          </div>

          {/* Maslow's Hierarchy */}
          <div className="bg-secondary/50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Based on Maslow's Hierarchy</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform uniquely addresses needs at both the bottom and top of Maslow's pyramid, 
                creating beneficial connections across different levels.
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Pyramid Visualization */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-16 bg-gradient-to-r from-peoplebook-yellow to-peoplebook-orange rounded-t-lg flex items-center justify-center text-center p-2">
                  <span className="text-xs font-medium">Self-Actualization</span>
                </div>
                <div className="w-48 h-16 bg-peoplebook-green/70 flex items-center justify-center text-center p-2">
                  <span className="text-xs font-medium">Esteem</span>
                </div>
                <div className="w-64 h-16 bg-peoplebook-blue/60 flex items-center justify-center text-center p-2">
                  <span className="text-xs font-medium">Love & Belonging</span>
                </div>
                <div className="w-80 h-16 bg-peoplebook-purple/50 flex items-center justify-center text-center p-2">
                  <span className="text-xs font-medium">Safety</span>
                </div>
                <div className="w-96 h-16 bg-peoplebook-darkPurple/40 rounded-b-lg flex items-center justify-center text-center p-2">
                  <span className="text-xs font-medium">Physiological Needs</span>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Top of the Pyramid</h3>
                  <p className="text-muted-foreground mb-4">
                    Those at the top of Maslow's hierarchy seek fulfillment through helping others, 
                    sharing knowledge, and contributing to society.
                  </p>
                  <p className="text-sm text-peoplebook-purple font-medium">
                    Producers: Experts, mentors, experienced professionals
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">Bottom of the Pyramid</h3>
                  <p className="text-muted-foreground mb-4">
                    Those addressing basic and growth needs benefit from guidance, education, 
                    and structured support systems.
                  </p>
                  <p className="text-sm text-peoplebook-purple font-medium">
                    Consumers: Learners, communities seeking development
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Movement</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Become part of Peoplebook.ai and contribute to a revolutionary approach to 
              non-formal education, mentoring, and societal growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90 px-8">
                Sign Up Now
              </Button>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="border-peoplebook-purple text-peoplebook-purple hover:bg-peoplebook-lightPurple px-8">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
