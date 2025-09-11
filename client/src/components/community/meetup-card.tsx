import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Meetup } from "@shared/schema";

interface MeetupCardProps {
  meetup: Meetup;
  onJoin?: () => void;
  onViewDetails?: () => void;
}

export default function MeetupCard({ meetup, onJoin, onViewDetails }: MeetupCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all" data-testid={`meetup-card-${meetup.id}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold text-lg" data-testid={`meetup-title-${meetup.id}`}>
              {meetup.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              Organized by {meetup.organizerId === "user-1" ? "You" : "Community Member"}
            </p>
          </div>
          <Badge className="bg-primary/20 text-primary">
            {meetup.ageGroup}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <i className="fas fa-calendar text-muted-foreground"></i>
            <span>{new Date(meetup.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt text-muted-foreground"></i>
            <span>{meetup.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-users text-muted-foreground"></i>
            <span>{Array.isArray(meetup.attendees) ? meetup.attendees.length : 0} attending</span>
          </div>
          {meetup.breedSize && (
            <div className="flex items-center space-x-2">
              <i className="fas fa-paw text-muted-foreground"></i>
              <span>{meetup.breedSize}</span>
            </div>
          )}
        </div>
        
        {meetup.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {meetup.description}
          </p>
        )}
        
        <div className="flex gap-2">
          {onJoin && (
            <Button className="flex-1" onClick={onJoin} data-testid={`button-join-${meetup.id}`}>
              Join Meetup
            </Button>
          )}
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails} data-testid={`button-details-${meetup.id}`}>
              Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
