
import { CalendarClock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface CollaborationCardProps {
  title: string;
  description: string;
  category: string;
  collaborators: {
    name: string;
    role: "Consumer" | "Producer" | "Ad-Hoc";
  }[];
  progress: number;
  dueDate: string;
  id: string;
}

const CollaborationCard = ({
  title,
  description,
  category,
  collaborators,
  progress,
  dueDate,
  id,
}: CollaborationCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-peoplebook-lightPurple text-peoplebook-darkPurple">
              {category}
            </Badge>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <CalendarClock className="w-4 h-4 mr-1" />
          <span>Due: {dueDate}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Users className="w-4 h-4 mr-1" />
          <span>
            {collaborators.map((c, i) => (
              <span key={i}>
                {c.name}
                <span className="text-xs ml-1 text-peoplebook-purple">({c.role})</span>
                {i < collaborators.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-2 mb-1">
          <div
            className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {progress}% Complete
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/collaboration/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CollaborationCard;
