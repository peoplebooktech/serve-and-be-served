
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className={`role-card border ${bgColor} shadow-sm overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="w-12 h-12 flex items-center justify-center text-peoplebook-blue mb-3">
          {icon}
        </div>
        <CardTitle className="text-xl text-peoplebook-text">{title}</CardTitle>
        <CardDescription className="text-slate-600 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <p className="text-sm text-slate-500">
          Experience the power of collaborative learning with Peoplebook
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onClick} 
          className="w-full btn-outline"
          variant="outline"
        >
          {btnText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
