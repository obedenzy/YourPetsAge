import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CommunityTrends() {
  const { data: trends } = useQuery({
    queryKey: ["/api/community/trends"],
  });

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Popular Foods */}
      <Card data-testid="trends-foods">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-utensils mr-2 text-primary"></i>
            Popular Foods
          </CardTitle>
          <p className="text-sm text-muted-foreground">For Young Adult Golden Retrievers</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {trends?.popularFoods?.map((food: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`popular-food-${index}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-primary/20' : index === 1 ? 'bg-accent/20' : 'bg-muted-foreground/20'
                }`}>
                  <span className={`text-xs font-bold ${
                    index === 0 ? 'text-primary' : index === 1 ? 'text-accent' : 'text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.percentage}% use this</p>
                </div>
              </div>
              <a href={food.amazonLink} className="text-accent hover:text-accent/80 text-xs font-medium">
                View →
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Trends */}
      <Card data-testid="trends-activities">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-running mr-2 text-accent"></i>
            Activities
          </CardTitle>
          <p className="text-sm text-muted-foreground">What owners do most often</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {trends?.activities?.map((activity: any, index: number) => (
            <div key={index} data-testid={`activity-${index}`}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{activity.name}</span>
                <span className="text-sm text-muted-foreground">{activity.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${index % 2 === 0 ? 'bg-primary' : 'bg-accent'}`}
                  style={{ width: `${activity.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommended Products */}
      <Card data-testid="trends-products">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-shopping-bag mr-2 text-primary"></i>
            Recommended
          </CardTitle>
          <p className="text-sm text-muted-foreground">Based on your pet's profile</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {trends?.recommendedProducts?.map((product: any, index: number) => (
            <div key={index} className="border border-border rounded-lg p-3 hover:border-primary/50 transition-all" data-testid={`product-${index}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <i className={`fas ${index === 0 ? 'fa-puzzle-piece' : 'fa-bed'} text-primary`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {index === 0 ? 'Mental stimulation for adults' : 'Joint support for large breeds'}
                  </p>
                  <p className="text-sm font-semibold text-accent">{product.price}</p>
                </div>
              </div>
              <a 
                href={product.amazonLink}
                className="block text-center bg-accent hover:bg-accent/90 text-accent-foreground py-2 rounded-lg text-sm font-medium transition-all"
              >
                View on Amazon
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
