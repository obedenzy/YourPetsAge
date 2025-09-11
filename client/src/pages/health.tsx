import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Health() {
  const { data: suggestions } = useQuery({
    queryKey: ["/api/health/suggestions"],
  });

  const { data: vets } = useQuery({
    queryKey: ["/api/vets/nearby"],
  });

  const { data: famousEquivalents } = useQuery({
    queryKey: ["/api/famous-equivalents", "28"],
  });

  return (
    <div className="container mx-auto px-4 py-8" data-testid="health-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Health & Wellness</h1>
          <p className="text-xl text-muted-foreground">Age-appropriate health suggestions for your pet</p>
          
          {/* Medical Disclaimer */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <i className="fas fa-exclamation-triangle text-amber-500 mt-1"></i>
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Medical Disclaimer</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  This information is not veterinary advice. Always consult with a qualified veterinarian for your pet's health needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Health Recommendations */}
          <div className="space-y-6">
            <Card data-testid="health-recommendations">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-heartbeat mr-2 text-red-500"></i>
                  Health Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="bg-background/50 p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <i className="fas fa-calendar-check mr-2 text-primary"></i>
                    Age-Based Checkups
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">For 3-year-old Golden Retrievers:</p>
                  <div className="space-y-2">
                    {suggestions?.checkups?.map((checkup: any, index: number) => (
                      <div key={index} className="flex items-center text-sm" data-testid={`checkup-${index}`}>
                        <i className={`fas mr-2 ${
                          checkup.status === 'completed' ? 'fa-check text-green-500' :
                          checkup.status === 'due' ? 'fa-clock text-yellow-500' :
                          'fa-eye text-blue-500'
                        }`}></i>
                        <span>{checkup.title}</span>
                        <Badge 
                          variant={checkup.status === 'completed' ? 'default' : 'secondary'}
                          className="ml-auto"
                        >
                          {checkup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-background/50 p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <i className="fas fa-shield-alt mr-2 text-accent"></i>
                    Preventive Care
                  </h4>
                  <div className="space-y-1 text-sm">
                    {suggestions?.preventiveCare?.map((care: string, index: number) => (
                      <div key={index} className="flex items-center" data-testid={`preventive-care-${index}`}>
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span>• {care}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-background/50 p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <i className="fas fa-utensils mr-2 text-primary"></i>
                    Nutrition Guidelines
                  </h4>
                  <div className="space-y-1 text-sm">
                    {suggestions?.nutrition?.map((guideline: string, index: number) => (
                      <div key={index} className="flex items-center" data-testid={`nutrition-${index}`}>
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span>• {guideline}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </CardContent>
            </Card>

            {/* Famous Equivalents */}
            <Card data-testid="famous-equivalents">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-star mr-2 text-accent"></i>
                  Famous Equivalents (28 human years)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-medium mb-2">🐕 Famous Dogs</h5>
                  {famousEquivalents?.dogs?.map((dog: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg mb-2" data-testid={`famous-dog-${index}`}>
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">🐕</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{dog.name}</p>
                        <p className="text-xs text-muted-foreground">{dog.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h5 className="font-medium mb-2">👤 Famous People</h5>
                  {famousEquivalents?.people?.map((person: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg mb-2" data-testid={`famous-person-${index}`}>
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-accent-foreground">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vet Finder & Activities */}
          <div className="space-y-6">
            <Card data-testid="vet-finder">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                  Nearby Veterinarians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vets?.map((vet: any) => (
                  <Card key={vet.id} className="border border-border p-4 hover:border-primary/50 transition-all" data-testid={`vet-${vet.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{vet.name}</h4>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-star text-accent text-sm"></i>
                        <span className="text-sm">{vet.rating}</span>
                        <span className="text-xs text-muted-foreground">({vet.reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{vet.address}, {vet.distance}</p>
                    <p className="text-xs text-muted-foreground mb-3">{vet.hours}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm" data-testid={`button-call-${vet.id}`}>
                        <i className="fas fa-phone mr-1"></i>
                        Call Now
                      </Button>
                      <Button variant="outline" className="flex-1" size="sm" data-testid={`button-directions-${vet.id}`}>
                        <i className="fas fa-directions mr-1"></i>
                        Directions
                      </Button>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Fun Activities */}
            <Card data-testid="fun-activities">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-gamepad mr-2 text-accent"></i>
                  Fun Activities for Young Adults
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Card className="bg-primary/10 border border-primary/20 p-3">
                  <h4 className="font-semibold text-sm mb-1">🏊‍♂️ Swimming Sessions</h4>
                  <p className="text-xs text-muted-foreground mb-2">Great exercise for joint health</p>
                  <Button variant="link" className="text-primary p-0 h-auto text-xs" data-testid="button-swimming">
                    Find dog-friendly pools →
                  </Button>
                </Card>

                <Card className="bg-accent/10 border border-accent/20 p-3">
                  <h4 className="font-semibold text-sm mb-1">🧩 Agility Training</h4>
                  <p className="text-xs text-muted-foreground mb-2">Perfect for mental and physical stimulation</p>
                  <Button variant="link" className="text-accent p-0 h-auto text-xs" data-testid="button-agility">
                    Shop agility equipment →
                  </Button>
                </Card>

                <Card className="bg-green-500/10 border border-green-500/20 p-3">
                  <h4 className="font-semibold text-sm mb-1">🥾 Hiking Adventures</h4>
                  <p className="text-xs text-muted-foreground mb-2">Explore nature trails together</p>
                  <Button variant="link" className="text-green-500 p-0 h-auto text-xs" data-testid="button-hiking">
                    Find local trails →
                  </Button>
                </Card>

                <Card className="bg-purple-500/10 border border-purple-500/20 p-3">
                  <h4 className="font-semibold text-sm mb-1">🎭 Puzzle Feeders</h4>
                  <p className="text-xs text-muted-foreground mb-2">Mental stimulation during meals</p>
                  <Button variant="link" className="text-purple-500 p-0 h-auto text-xs" data-testid="button-puzzle">
                    Shop puzzle feeders →
                  </Button>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
