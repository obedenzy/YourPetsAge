import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Leaderboard() {
  // Mock data for achievements and leaderboards
  const userAchievements = [
    { id: 1, type: "Birthday Buddy", description: "Celebrated 1st birthday", icon: "fa-birthday-cake", color: "from-accent to-yellow-500", unlocked: true },
    { id: 2, type: "Cosmic Explorer", description: "Unlocked cosmic age", icon: "fa-star", color: "from-primary to-cosmic-blue", unlocked: true },
    { id: 3, type: "Social Pup", description: "Joined 3 meetups", icon: "fa-users", color: "from-green-500 to-emerald-500", unlocked: true },
    { id: 4, type: "Forum Helper", description: "Made 10 helpful forum posts", icon: "fa-comments", color: "from-blue-500 to-indigo-500", unlocked: true },
    { id: 5, type: "Senior Sage", description: "Reach 7+ years", icon: "fa-crown", color: "from-purple-500 to-pink-500", unlocked: false },
    { id: 6, type: "Health Champion", description: "Complete 5 vet visits", icon: "fa-heartbeat", color: "from-red-500 to-pink-500", unlocked: false },
  ];

  const leaderboards = {
    mostActive: [
      { rank: 1, name: "Sarah M.", points: 2847, badge: "gold" },
      { rank: 2, name: "Mike R.", points: 2103, badge: "silver" },
      { rank: 3, name: "You", points: 1892, badge: "bronze" },
      { rank: 4, name: "Emma L.", points: 1765, badge: null },
      { rank: 5, name: "David K.", points: 1543, badge: null },
    ],
    oldestPets: [
      { rank: 1, name: "Max (German Shepherd)", age: "14y 2m" },
      { rank: 2, name: "Bella (Golden Retriever)", age: "13y 8m" },
      { rank: 3, name: "Charlie (Labrador)", age: "12y 11m" },
      { rank: 4, name: "Luna (Beagle)", age: "12y 3m" },
      { rank: 5, name: "Rocky (Bulldog)", age: "11y 9m" },
    ],
    cosmicReports: [
      { rank: 1, name: "Luna's Human", reports: 47 },
      { rank: 2, name: "Buddy's Parent", reports: 31 },
      { rank: 3, name: "Rocky's Owner", reports: 28 },
      { rank: 4, name: "Max's Family", reports: 24 },
      { rank: 5, name: "Bella's Mom", reports: 19 },
    ]
  };

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case "gold": return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "silver": return "bg-gradient-to-r from-gray-300 to-gray-500";
      case "bronze": return "bg-gradient-to-r from-amber-400 to-amber-600";
      default: return "bg-muted-foreground/20";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="leaderboard-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Achievements & Leaderboards</h1>
          <p className="text-xl text-muted-foreground">Celebrate milestones and connect with top pet parents</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Badges/Achievements */}
          <div>
            <Card data-testid="user-achievements">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-trophy mr-2 text-accent"></i>
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {userAchievements.map((achievement) => (
                    <Card 
                      key={achievement.id} 
                      className={`p-4 text-center transition-all ${
                        achievement.unlocked 
                          ? `bg-gradient-to-br ${achievement.color}/20 border-current` 
                          : 'opacity-50 border-dashed'
                      }`}
                      data-testid={`achievement-${achievement.id}`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-2 ${
                        !achievement.unlocked ? 'grayscale' : ''
                      }`}>
                        <i className={`fas ${achievement.icon} text-white`}></i>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{achievement.type}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <Badge className="mt-2 bg-green-500/20 text-green-600 border-green-500/30">
                          Unlocked
                        </Badge>
                      )}
                    </Card>
                  ))}
                </div>

                <Card className="bg-background/50 p-4" data-testid="achievement-progress">
                  <h4 className="font-medium mb-2">Progress to Next Badge</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Health Champion (5 vet visits)</span>
                      <span className="text-muted-foreground">3/5</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">2 more vet visits to unlock this badge</p>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboards */}
          <div className="space-y-6">
            <Card data-testid="leaderboard-active">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-medal mr-2 text-primary"></i>
                  Most Active Pet Parents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboards.mostActive.map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        user.name === "You" ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                      }`}
                      data-testid={`active-rank-${user.rank}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBadgeColor(user.badge)} text-white`}>
                          {user.rank}
                        </span>
                        <span className={`font-medium ${user.name === "You" ? 'text-primary' : ''}`}>
                          {user.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{user.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="leaderboard-oldest">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-clock mr-2 text-accent"></i>
                  Oldest Pups in Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {leaderboards.oldestPets.map((pet) => (
                    <div key={pet.rank} className="flex items-center justify-between" data-testid={`oldest-rank-${pet.rank}`}>
                      <span className="flex items-center">
                        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {pet.rank}
                        </span>
                        🐕 {pet.name}
                      </span>
                      <span className="font-medium">{pet.age}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="leaderboard-cosmic">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-star mr-2 text-cosmic-blue"></i>
                  Most Cosmic Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {leaderboards.cosmicReports.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between" data-testid={`cosmic-rank-${user.rank}`}>
                      <span className="flex items-center">
                        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {user.rank}
                        </span>
                        {user.name}
                      </span>
                      <span className="font-medium">{user.reports} reports</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center" data-testid="cta-section">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-8">
            <h3 className="text-2xl font-bold mb-4">Climb the Leaderboards!</h3>
            <p className="text-muted-foreground mb-6">
              Engage with the community, share your pet's journey, and unlock exclusive achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button data-testid="button-join-meetup">
                <i className="fas fa-users mr-2"></i>
                Join a Meetup
              </Button>
              <Button variant="outline" data-testid="button-create-post">
                <i className="fas fa-edit mr-2"></i>
                Create Forum Post
              </Button>
              <Button variant="outline" data-testid="button-share-cosmic">
                <i className="fas fa-share mr-2"></i>
                Share Cosmic Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
