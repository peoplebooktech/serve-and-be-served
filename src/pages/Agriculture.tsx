
import { Leaf, Sprout, Tractor, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Agriculture = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-green-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
                <Leaf className="w-8 h-8 text-peoplebook-agriculture" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-peoplebook-text">Agriculture Vertical</h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Connecting farmers with experts to enhance sustainable agricultural practices and improve food production through knowledge sharing.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Sprout className="w-12 h-12 text-peoplebook-agriculture mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sustainable Farming</h3>
                <p className="text-slate-600">Learn sustainable farming practices from experts and fellow farmers to enhance productivity and reduce environmental impact.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Tractor className="w-12 h-12 text-peoplebook-agriculture mb-4" />
                <h3 className="text-xl font-semibold mb-2">Farm Management</h3>
                <p className="text-slate-600">Gain insights on effective farm management techniques, resource optimization, and business planning.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Cloud className="w-12 h-12 text-peoplebook-agriculture mb-4" />
                <h3 className="text-xl font-semibold mb-2">Climate Adaptation</h3>
                <p className="text-slate-600">Learn strategies to adapt farming practices to changing climate conditions and weather patterns.</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-peoplebook-agriculture hover:bg-peoplebook-agriculture/90 text-white px-8 py-6">
                Get Started in Agriculture
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agriculture;
