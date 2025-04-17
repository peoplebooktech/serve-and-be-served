
import { ArrowRight, BrainCircuit, Code2, PercentCircle, Presentation, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How Peoplebook.ai Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform facilitates collaborative non-formal education by connecting 
              individuals, communities, and organizations based on specific needs and expertise.
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-20 mb-16">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center rounded-full bg-peoplebook-lightPurple px-3 py-1 text-sm font-medium text-peoplebook-purple mb-4">
                  Step 1
                </div>
                <h2 className="text-3xl font-bold mb-4">Create Your Profile</h2>
                <p className="text-muted-foreground mb-6">
                  Begin by signing up and creating your profile on Peoplebook.ai. Select your role 
                  as a Consumer (seeking knowledge), Producer (sharing expertise), or Ad-Hoc 
                  (facilitating connections).
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Specify your category (individual, group/community, or corporate)</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Define your interests, needs, or areas of expertise</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Set your availability and preferred collaboration timeframes</span>
                  </li>
                </ul>
                <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90">
                  Create Your Profile
                </Button>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative max-w-sm">
                  <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-peoplebook-yellow opacity-40"></div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Profile creation" 
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative max-w-sm">
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-peoplebook-green opacity-40"></div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Matching process" 
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full bg-peoplebook-lightPurple px-3 py-1 text-sm font-medium text-peoplebook-purple mb-4">
                  Step 2
                </div>
                <h2 className="text-3xl font-bold mb-4">Intelligent Matching</h2>
                <p className="text-muted-foreground mb-6">
                  Our advanced matching system identifies the top 5 profiles that align with your 
                  specific needs, context, and goals. For Consumers, this means finding the 
                  most suitable Producers to assist with your learning journey.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Algorithm considers expertise, background, and availability</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>AI profiles are suggested when human matches are unavailable</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Both parties must accept for the collaboration to begin</span>
                  </li>
                </ul>
                <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90">
                  Explore Matching
                </Button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center rounded-full bg-peoplebook-lightPurple px-3 py-1 text-sm font-medium text-peoplebook-purple mb-4">
                  Step 3
                </div>
                <h2 className="text-3xl font-bold mb-4">Define Your Roadmap</h2>
                <p className="text-muted-foreground mb-6">
                  Once matched, you'll collaborate to create a customized roadmap with clear 
                  milestones and objectives. This structured approach ensures focused progress 
                  toward your educational or developmental goals.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Set timeframes ranging from one week to six months</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Establish three key milestones to track progress</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Define specific actions and requirements for each milestone</span>
                  </li>
                </ul>
                <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90">
                  Create Roadmap
                </Button>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative max-w-sm">
                  <div className="absolute top-1/2 -right-6 w-16 h-16 rounded-full bg-peoplebook-orange opacity-40"></div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Roadmap planning" 
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative max-w-sm">
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-peoplebook-blue opacity-20"></div>
                  <div className="bg-white p-4 rounded-2xl shadow-lg relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                      alt="Collaboration journey" 
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full bg-peoplebook-lightPurple px-3 py-1 text-sm font-medium text-peoplebook-purple mb-4">
                  Step 4
                </div>
                <h2 className="text-3xl font-bold mb-4">Collaborate and Grow</h2>
                <p className="text-muted-foreground mb-6">
                  Engage in meaningful collaboration through the platform's integrated tools. 
                  Track progress, communicate with your partners, and adapt your approach as needed 
                  to achieve optimal results.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access built-in communication and knowledge-sharing tools</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Monitor milestone completion and overall progress</span>
                  </li>
                  <li className="flex">
                    <ArrowRight className="h-5 w-5 text-peoplebook-purple mr-2 flex-shrink-0 mt-0.5" />
                    <span>Receive guidance and adjust goals as needed</span>
                  </li>
                </ul>
                <Button className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90">
                  Start Collaborating
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-secondary/50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The Peoplebook.ai Difference</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform isn't just about education—it's about transforming society through 
                meaningful connections and collaborative learning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl">
                <Users className="h-10 w-10 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Reducing Inequality</h3>
                <p className="text-muted-foreground">
                  By connecting diverse groups and facilitating knowledge sharing, we help reduce 
                  educational and opportunity gaps across communities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <Target className="h-10 w-10 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unlocking Potential</h3>
                <p className="text-muted-foreground">
                  Our structured approach helps individuals and organizations discover and maximize 
                  their capabilities through guided learning experiences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <BrainCircuit className="h-10 w-10 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Enhanced Matching</h3>
                <p className="text-muted-foreground">
                  Our intelligent algorithm ensures optimal connections between learners and mentors, 
                  with AI profiles available when needed.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <Presentation className="h-10 w-10 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Structured Growth</h3>
                <p className="text-muted-foreground">
                  Clear roadmaps and milestone tracking provide a framework for measurable progress 
                  and successful outcomes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <Code2 className="h-10 w-10 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Co-Creation Focus</h3>
                <p className="text-muted-foreground">
                  Our platform encourages collaborative creation and shared experiences, fostering 
                  innovation and mutual growth.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl">
                <PercentCircle className="h-10 w-10 text-peoplebook-purple mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Analytics</h3>
                <p className="text-muted-foreground">
                  Advanced reporting and statistics help organizations track impact and identify 
                  opportunities for improvement.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join Peoplebook.ai today and become part of our growing community of learners, 
              mentors, and facilitators working together to transform education and society.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue hover:opacity-90 px-8">
                Sign Up Now
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="border-peoplebook-purple text-peoplebook-purple hover:bg-peoplebook-lightPurple px-8">
                  View Dashboard Demo
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

export default HowItWorks;
