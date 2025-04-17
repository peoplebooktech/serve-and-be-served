
import { Trophy, Target, Dumbbell, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Sports = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-amber-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-peoplebook-sports" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-peoplebook-text">Sports Vertical</h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Building athletic communities through coaching, training, and performance enhancement methodologies shared between experts and enthusiasts.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Dumbbell className="w-12 h-12 text-peoplebook-sports mb-4" />
                <h3 className="text-xl font-semibold mb-2">Athletic Training</h3>
                <p className="text-slate-600">Access specialized training programs and techniques from professional coaches and trainers.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Target className="w-12 h-12 text-peoplebook-sports mb-4" />
                <h3 className="text-xl font-semibold mb-2">Performance Goals</h3>
                <p className="text-slate-600">Set and achieve your performance goals with personalized guidance from sports professionals.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <Medal className="w-12 h-12 text-peoplebook-sports mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sports Communities</h3>
                <p className="text-slate-600">Connect with like-minded sports enthusiasts to share experiences, tips, and motivation.</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-peoplebook-sports hover:bg-peoplebook-sports/90 text-white px-8 py-6">
                Get Started in Sports
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sports;
