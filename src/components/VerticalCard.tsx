
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    <Card className={`vertical-card border ${bgColor} shadow-sm overflow-hidden h-full`}>
      <CardHeader className="pb-3">
        <div className={`w-12 h-12 flex items-center justify-center ${textColor} mb-3`}>
          {icon}
        </div>
        <CardTitle className="text-xl text-peoplebook-text">{title}</CardTitle>
        <CardDescription className="text-slate-600 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <p className="text-sm text-slate-500">
          Collaborate and grow in the {title.toLowerCase()} sector with Peoplebook.ai
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          asChild
          variant="outline"
          className={`w-full border ${textColor}`}
        >
          <Link to={linkTo}>
            Explore {title}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerticalCard;
