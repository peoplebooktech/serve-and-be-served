
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  btnText?: string;
  onClick?: () => void;
}

const RoleCard = ({ 
  title, 
  description, 
  icon, 
  bgColor, 
  btnText = "Learn More", 
  onClick 
}: RoleCardProps) => {
  return (
    <Card className={`group role-card bg-white/80 backdrop-blur-sm border-2 ${bgColor} shadow-xl hover:shadow-2xl overflow-hidden h-full transition-all duration-300 hover:scale-105`}>
      <CardHeader className="pb-4">
        <div className="w-16 h-16 flex items-center justify-center text-peoplebook-blue mb-4 bg-gradient-to-r from-peoplebook-blue/10 to-peoplebook-purple/10 rounded-2xl group-hover:from-peoplebook-blue/20 group-hover:to-peoplebook-purple/20 transition-all duration-300">
          {icon}
        </div>
        <CardTitle className="text-2xl text-peoplebook-text mb-2">{title}</CardTitle>
        <CardDescription className="text-slate-600 text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-500">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            AI-Enhanced Matching
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Smart Collaboration Tools
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
            Progress Tracking
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onClick} 
          className="w-full bg-gradient-to-r from-peoplebook-purple/10 to-peoplebook-blue/10 hover:from-peoplebook-purple hover:to-peoplebook-blue hover:text-white border-0 text-peoplebook-blue group-hover:shadow-lg transition-all duration-300"
        >
          <span className="flex items-center justify-center">
            {btnText}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
