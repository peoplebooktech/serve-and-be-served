
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
    <Card className={`role-card border-2 ${bgColor} overflow-hidden`}>
      <CardHeader className="pb-2">
        <div className="w-12 h-12 flex items-center justify-center text-peoplebook-purple mb-2">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Collaborate, learn, and grow with Peoplebook.ai
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onClick} 
          className="w-full bg-white text-peoplebook-purple border border-peoplebook-purple hover:bg-peoplebook-lightPurple"
        >
          {btnText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
