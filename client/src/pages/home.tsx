import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden cosmic-bg min-h-screen flex items-center" data-testid="hero-section">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Discover Your Pet's
              <span className="bg-gradient-to-r from-primary via-cosmic-blue to-accent bg-clip-text text-transparent">
                {" "}Cosmic Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
              Calculate your pet's age with veterinary precision, explore their cosmic equivalent, 
              and connect with a community of pet lovers across the universe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/calculator">
                <Button size="lg" className="text-lg px-8 py-4 transform hover:scale-105" data-testid="button-calculate">
                  <i className="fas fa-calculator mr-2"></i>
                  Calculate Pet Age
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 transform hover:scale-105" data-testid="button-community">
                  <i className="fas fa-users mr-2"></i>
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="glass-morphism p-6 text-center" data-testid="stat-calculations">
                <div className="text-3xl font-bold text-primary mb-2">15,847</div>
                <div className="text-sm text-muted-foreground">Age Calculations</div>
              </Card>
              <Card className="glass-morphism p-6 text-center" data-testid="stat-pets">
                <div className="text-3xl font-bold text-accent mb-2">3,291</div>
                <div className="text-sm text-muted-foreground">Happy Pets</div>
              </Card>
              <Card className="glass-morphism p-6 text-center" data-testid="stat-meetups">
                <div className="text-3xl font-bold text-cosmic-blue mb-2">1,029</div>
                <div className="text-sm text-muted-foreground">Meetups Organized</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-card" data-testid="features-section">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-muted-foreground">Comprehensive tools for pet parents</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-calculator">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-calculator text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Precise Age Calculator</h3>
                <p className="text-muted-foreground mb-4">
                  Calculate your pet's age down to milliseconds using veterinary formulas for different breed sizes.
                </p>
                <Link href="/calculator">
                  <Button variant="outline" size="sm">Try Calculator</Button>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-cosmic">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-star text-accent text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Cosmic Age Translation</h3>
                <p className="text-muted-foreground mb-4">
                  See your pet's age in stellar and galactic terms with shareable cosmic reports.
                </p>
                <Link href="/premium">
                  <Button variant="outline" size="sm">Explore Cosmic</Button>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-community">
                <div className="w-12 h-12 bg-cosmic-blue/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-users text-cosmic-blue text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pet Community</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with owners of similar-aged pets through meetups and forums.
                </p>
                <Link href="/community">
                  <Button variant="outline" size="sm">Join Community</Button>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-health">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-heartbeat text-red-500 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Health Insights</h3>
                <p className="text-muted-foreground mb-4">
                  Age-based health recommendations and nearby veterinarian finder.
                </p>
                <Link href="/health">
                  <Button variant="outline" size="sm">Health Tips</Button>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-ar">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-camera text-purple-500 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">AR Experiences</h3>
                <p className="text-muted-foreground mb-4">
                  Transform your pet with augmented reality filters showing different ages.
                </p>
                <Link href="/premium">
                  <Button variant="outline" size="sm">Try AR</Button>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-achievements">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-trophy text-yellow-500 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Achievements</h3>
                <p className="text-muted-foreground mb-4">
                  Earn badges for milestones and compete on community leaderboards.
                </p>
                <Link href="/leaderboard">
                  <Button variant="outline" size="sm">View Badges</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
