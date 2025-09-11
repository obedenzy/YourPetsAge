import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Community() {
  const { data: trends } = useQuery({
    queryKey: ["/api/community/trends"],
  });

  return (
    <div className="container mx-auto px-4 py-8" data-testid="community-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
          <p className="text-xl text-muted-foreground">Connect, discover, and share with fellow pet parents</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Community Trends */}
          <Card data-testid="community-trends">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-line mr-2 text-primary"></i>
                Community Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="bg-background/50 p-4">
                <h4 className="font-medium mb-2">Popular with 3-year-old Golden Retrievers:</h4>
                <div className="space-y-2 text-sm">
                  {trends?.popularFoods?.map((food: any, index: number) => (
                    <div key={index} className="flex items-center justify-between" data-testid={`popular-food-${index}`}>
                      <span>🥘 {food.name}</span>
                      <a href={food.amazonLink} className="text-primary hover:underline">View</a>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="bg-background/50 p-4">
                <h4 className="font-medium mb-2">Activity Trends:</h4>
                <div className="space-y-2 text-sm">
                  {trends?.activities?.map((activity: any, index: number) => (
                    <div key={index} className="space-y-1" data-testid={`activity-${index}`}>
                      <div className="flex justify-between">
                        <span>{activity.name}</span>
                        <span className="text-muted-foreground">{activity.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${activity.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </CardContent>
          </Card>

          {/* Meetups */}
          <Card data-testid="community-meetups">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-accent"></i>
                Local Meetups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="bg-background/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Golden Retriever Playdate</h4>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Tomorrow</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Central Park Dog Run</p>
                <p className="text-sm text-muted-foreground mb-3">5 pets attending • Ages 2-5 years</p>
                <Button className="w-full" size="sm" data-testid="button-join-meetup-1">
                  Join Meetup
                </Button>
              </Card>
              
              <Card className="bg-background/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Puppy Training Group</h4>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Sat</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Riverside Dog Park</p>
                <p className="text-sm text-muted-foreground mb-3">8 pets attending • Ages 6m-2y</p>
                <Button variant="secondary" className="w-full" size="sm" data-testid="button-join-meetup-2">
                  Request to Join
                </Button>
              </Card>

              <Link href="/meetups" className="block">
                <Button variant="outline" className="w-full" data-testid="button-view-all-meetups">
                  <i className="fas fa-eye mr-2"></i>
                  View All Meetups
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Forums */}
          <Card data-testid="community-forums">
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-comments mr-2 text-cosmic-blue"></i>
                Age-Grouped Forums
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="bg-background/50 p-4">
                <h4 className="font-medium mb-2">🐶 Puppy Parents (0-1 year)</h4>
                <p className="text-sm text-muted-foreground mb-2">Latest: "Teething tips for 6-month-old lab"</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>847 members</span>
                  <span>2 hours ago</span>
                </div>
              </Card>
              
              <Card className="bg-background/50 p-4">
                <h4 className="font-medium mb-2">🦴 Young Adults (1-3 years)</h4>
                <p className="text-sm text-muted-foreground mb-2">Latest: "Best toys for energetic 2-year-old"</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>1,203 members</span>
                  <span>45 minutes ago</span>
                </div>
              </Card>
              
              <Card className="bg-background/50 p-4">
                <h4 className="font-medium mb-2">🎯 Adult Dogs (3-7 years)</h4>
                <p className="text-sm text-muted-foreground mb-2">Latest: "Training stubborn 5-year-old beagle"</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>892 members</span>
                  <span>1 hour ago</span>
                </div>
              </Card>

              <Link href="/forums" className="block">
                <Button variant="outline" className="w-full" data-testid="button-view-all-forums">
                  <i className="fas fa-eye mr-2"></i>
                  View All Forums
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trends?.recommendedProducts?.map((product: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-all transform hover:scale-105" data-testid={`product-${index}`}>
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-bone text-primary"></i>
                  </div>
                  <h4 className="font-medium text-sm mb-2">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">Recommended for your pet's age</p>
                  <p className="text-sm font-semibold text-accent mb-3">{product.price}</p>
                  <a 
                    href={product.amazonLink} 
                    className="block text-center bg-accent hover:bg-accent/90 text-accent-foreground py-2 rounded-lg text-sm font-medium transition-all"
                    data-testid={`product-link-${index}`}
                  >
                    View on Amazon
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
