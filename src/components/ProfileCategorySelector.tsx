
import { useState } from "react";
import { Users, User, Building2, Building, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProfileCategorySelectorProps {
  onChange: (category: string) => void;
}

const ProfileCategorySelector = ({ onChange }: ProfileCategorySelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    onChange(value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Select Profile Category</h3>
        <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="flex items-start space-x-2 p-4 border rounded-md hover:border-peoplebook-purple hover:bg-peoplebook-lightPurple/20 transition-colors cursor-pointer">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="flex items-start cursor-pointer">
                <User className="h-5 w-5 mr-2 text-peoplebook-purple mt-0.5" />
                <div>
                  <span className="font-medium block">Individual</span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    Personal growth and learning
                  </span>
                </div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 p-4 border rounded-md hover:border-peoplebook-purple hover:bg-peoplebook-lightPurple/20 transition-colors cursor-pointer">
              <RadioGroupItem value="community" id="community" />
              <Label htmlFor="community" className="flex items-start cursor-pointer">
                <Users className="h-5 w-5 mr-2 text-peoplebook-purple mt-0.5" />
                <div>
                  <span className="font-medium block">Community</span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    Villages, municipalities, cities
                  </span>
                </div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 p-4 border rounded-md hover:border-peoplebook-purple hover:bg-peoplebook-lightPurple/20 transition-colors cursor-pointer">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company" className="flex items-start cursor-pointer">
                <Building2 className="h-5 w-5 mr-2 text-peoplebook-purple mt-0.5" />
                <div>
                  <span className="font-medium block">Corporate</span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    Companies and organizations
                  </span>
                </div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 p-4 border rounded-md hover:border-peoplebook-purple hover:bg-peoplebook-lightPurple/20 transition-colors cursor-pointer">
              <RadioGroupItem value="institution" id="institution" />
              <Label htmlFor="institution" className="flex items-start cursor-pointer">
                <Building className="h-5 w-5 mr-2 text-peoplebook-purple mt-0.5" />
                <div>
                  <span className="font-medium block">Institution</span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    Educational and nonprofit institutions
                  </span>
                </div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 p-4 border rounded-md hover:border-peoplebook-purple hover:bg-peoplebook-lightPurple/20 transition-colors cursor-pointer">
              <RadioGroupItem value="global" id="global" />
              <Label htmlFor="global" className="flex items-start cursor-pointer">
                <Globe className="h-5 w-5 mr-2 text-peoplebook-purple mt-0.5" />
                <div>
                  <span className="font-medium block">Global</span>
                  <span className="text-sm text-muted-foreground block mt-1">
                    International and multinational entities
                  </span>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ProfileCategorySelector;
