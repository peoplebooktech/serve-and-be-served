
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface VerticalCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  linkTo: string;
}

const VerticalCard = ({ 
  title, 
  description, 
  icon, 
  bgColor,
  textColor,
  linkTo
}: VerticalCardProps) => {
  return (
    <Card className={`group vertical-card border-0 ${bgColor} shadow-xl hover:shadow-2xl overflow-hidden h-full transition-all duration-300 hover:scale-105`}>
      <CardHeader className="pb-4">
        <div className={`w-16 h-16 flex items-center justify-center ${textColor} mb-4 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors duration-300`}>
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
            AI-Powered Matching
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            Expert Networks
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
            Collaborative Growth
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          asChild
          className={`w-full bg-white/10 hover:bg-white hover:text-peoplebook-text border-0 backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-lg`}
        >
          <Link to={linkTo} className="flex items-center justify-center">
            Explore {title}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerticalCard;
