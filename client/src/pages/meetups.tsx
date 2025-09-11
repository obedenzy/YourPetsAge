import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Meetups() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [breedSize, setBreedSize] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: meetups, isLoading } = useQuery({
    queryKey: ["/api/meetups"],
  });

  const createMeetup = useMutation({
    mutationFn: async (meetupData: any) => {
      const response = await apiRequest("POST", "/api/meetups", meetupData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetups"] });
      setShowCreateForm(false);
      setTitle("");
      setDate("");
      setLocation("");
      setAgeGroup("");
      setBreedSize("");
      toast({
        title: "Meetup Created",
        description: "Your meetup has been created successfully!",
      });
    },
  });

  const joinMeetup = useMutation({
    mutationFn: async (meetupId: string) => {
      const response = await apiRequest("POST", `/api/meetups/${meetupId}/join`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetups"] });
      toast({
        title: "Joined Meetup",
        description: "You've successfully joined the meetup!",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !location || !ageGroup) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMeetup.mutateAsync({
        title,
        date: new Date(date),
        location,
        ageGroup,
        breedSize,
        description: `Meetup for ${ageGroup} pets`,
        maxAttendees: 10,
        attendees: [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meetup. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]" data-testid="loading-spinner">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="meetups-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pet Meetups</h1>
          <p className="text-xl text-muted-foreground">Connect with local pet owners for playdates and activities</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Meetup */}
          <div className="lg:col-span-1">
            <Card data-testid="create-meetup-card">
              <CardHeader>
                <CardTitle>Create Meetup</CardTitle>
              </CardHeader>
              <CardContent>
                {!showCreateForm ? (
                  <Button 
                    onClick={() => setShowCreateForm(true)} 
                    className="w-full" 
                    data-testid="button-show-create-form"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Create New Meetup
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Meetup Title</Label>
                      <Input
                        id="title"
                        placeholder="Young Adult Dog Playdate"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        data-testid="input-meetup-title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Date & Time</Label>
                      <Input
                        id="date"
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        data-testid="input-meetup-date"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Central Park Dog Run"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        data-testid="input-meetup-location"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ageGroup">Age Group</Label>
                      <Select value={ageGroup} onValueChange={setAgeGroup}>
                        <SelectTrigger data-testid="select-age-group">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Ages">All Ages</SelectItem>
                          <SelectItem value="Puppies (0-1 year)">Puppies (0-1 year)</SelectItem>
                          <SelectItem value="Young Adults (1-3 years)">Young Adults (1-3 years)</SelectItem>
                          <SelectItem value="Adults (3-7 years)">Adults (3-7 years)</SelectItem>
                          <SelectItem value="Seniors (7+ years)">Seniors (7+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="breedSize">Breed Size</Label>
                      <Select value={breedSize} onValueChange={setBreedSize}>
                        <SelectTrigger data-testid="select-breed-size">
                          <SelectValue placeholder="Select breed size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Sizes">All Sizes</SelectItem>
                          <SelectItem value="Small Breeds">Small Breeds</SelectItem>
                          <SelectItem value="Medium Breeds">Medium Breeds</SelectItem>
                          <SelectItem value="Large Breeds">Large Breeds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={createMeetup.isPending}
                        data-testid="button-create-meetup"
                      >
                        {createMeetup.isPending ? "Creating..." : "Create"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                        data-testid="button-cancel-create"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Meetup List */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-6">Nearby Meetups</h3>
            
            <div className="space-y-4">
              {meetups?.map((meetup: any) => (
                <Card key={meetup.id} className="hover:shadow-lg transition-all" data-testid={`meetup-card-${meetup.id}`}>
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
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        {meetup.ageGroup}
                      </span>
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
                      <Button 
                        className="flex-1" 
                        onClick={() => joinMeetup.mutate(meetup.id)}
                        disabled={joinMeetup.isPending}
                        data-testid={`button-join-${meetup.id}`}
                      >
                        {joinMeetup.isPending ? "Joining..." : "Join Meetup"}
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-details-${meetup.id}`}>
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!meetups || meetups.length === 0) && (
                <div className="text-center py-12" data-testid="no-meetups-message">
                  <i className="fas fa-calendar text-4xl text-muted-foreground mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2">No Meetups Yet</h3>
                  <p className="text-muted-foreground mb-6">Be the first to create a meetup in your area!</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Create First Meetup
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
