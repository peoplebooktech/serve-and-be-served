
import { CheckCircle2, Circle } from "lucide-react";

interface MilestoneProps {
  milestones: {
    title: string;
    description: string;
    completed: boolean;
  }[];
  duration: string;
}

const MilestoneTracker = ({ milestones, duration }: MilestoneProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Collaboration Progress</h3>
        <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {duration}
        </span>
      </div>
      
      <div className="relative">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex mb-8 last:mb-0">
            <div className="mr-4 flex flex-col items-center">
              {milestone.completed ? (
                <CheckCircle2 className="w-8 h-8 text-peoplebook-purple" />
              ) : (
                <Circle className="w-8 h-8 text-muted-foreground" />
              )}
              {index !== milestones.length - 1 && (
                <div className={`w-0.5 h-full ${milestone.completed ? "bg-peoplebook-purple" : "bg-muted"} my-1`} />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{milestone.title}</h4>
              <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneTracker;
