
import { BookOpen, GraduationCap, School, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Education = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-indigo-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-peoplebook-education" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-peoplebook-text">Education Vertical</h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Transforming learning experiences through peer-to-peer knowledge sharing and mentorship in formal and non-formal educational settings.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <GraduationCap className="w-12 h-12 text-peoplebook-education mb-4" />
                <h3 className="text-xl font-semibold mb-2">Academic Mentorship</h3>
                <p className="text-slate-600">Connect with mentors who can guide your academic journey and help you achieve your educational goals.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <School className="w-12 h-12 text-peoplebook-education mb-4" />
                <h3 className="text-xl font-semibold mb-2">Institutional Collaboration</h3>
                <p className="text-slate-600">Enable educational institutions to collaborate and share resources for maximum impact.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Library className="w-12 h-12 text-peoplebook-education mb-4" />
                <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
                <p className="text-slate-600">Access a wide range of learning materials and resources contributed by our community of educators.</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-peoplebook-education hover:bg-peoplebook-education/90 text-white px-8 py-6">
                Get Started in Education
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Education;
