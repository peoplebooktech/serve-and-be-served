
import { Stethoscope, Heart, Activity, FirstAid } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Healthcare = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-cyan-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-cyan-100 rounded-full mb-4">
                <Stethoscope className="w-8 h-8 text-peoplebook-healthcare" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-peoplebook-text">Healthcare Vertical</h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Improving access to healthcare knowledge and resources through collaboration between healthcare professionals, patients, and communities.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Heart className="w-12 h-12 text-peoplebook-healthcare mb-4" />
                <h3 className="text-xl font-semibold mb-2">Patient Education</h3>
                <p className="text-slate-600">Connect patients with healthcare professionals for personalized health education and guidance.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Activity className="w-12 h-12 text-peoplebook-healthcare mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Health</h3>
                <p className="text-slate-600">Empower communities with knowledge and resources to improve collective health outcomes.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <FirstAid className="w-12 h-12 text-peoplebook-healthcare mb-4" />
                <h3 className="text-xl font-semibold mb-2">Healthcare Training</h3>
                <p className="text-slate-600">Facilitate training and knowledge sharing among healthcare professionals across different specialties.</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-peoplebook-healthcare hover:bg-peoplebook-healthcare/90 text-white px-8 py-6">
                Get Started in Healthcare
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Healthcare;
