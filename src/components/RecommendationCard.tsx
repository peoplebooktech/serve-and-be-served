import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface RecommendationCardProps {
  id: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  skills: string[];
  matchScore: number;
  image_url?: string;
}

const RecommendationCard = ({ 
  id, 
  name, 
  title, 
  company, 
  bio, 
  skills, 
  matchScore, 
  image_url 
}: RecommendationCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {image_url ? (
              <img
                src={image_url}
                alt={name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{name}</h3>
              <div className="flex items-center text-sm text-primary">
                <Star className="w-4 h-4 mr-1" />
                {matchScore}% Match
              </div>
            </div>
            
            {(title || company) && (
              <p className="text-sm text-muted-foreground mb-2">
                {title} {title && company && 'at'} {company}
              </p>
            )}
            
            {bio && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {bio}
              </p>
            )}
            
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <Link to={`/profiles/${id}`}>
                <Button size="sm" variant="outline" className="flex-1">
                  <User className="w-3 h-3 mr-1" />
                  View Profile
                </Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue text-white">
                <MessageCircle className="w-3 h-3 mr-1" />
                Connect
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;