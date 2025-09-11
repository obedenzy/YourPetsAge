import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser, useUpdateTokens } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Premium() {
  const { data: user } = useUser();
  const updateTokens = useUpdateTokens();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"tokens" | "subscription" | null>(null);

  const handleFeatureClick = (feature: string, cost: number) => {
    if (!user || user.tokens < cost) {
      toast({
        title: "Insufficient Tokens",
        description: `You need ${cost} tokens to use this feature. Purchase more tokens or upgrade to premium.`,
        variant: "destructive",
      });
      return;
    }

    // Simulate using tokens
    updateTokens.mutate(user.tokens - cost);
    
    toast({
      title: "Feature Unlocked",
      description: `You've used ${cost} token${cost > 1 ? 's' : ''} to access ${feature}!`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="premium-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium Features</h1>
          <p className="text-xl text-muted-foreground">Unlock advanced features with tokens or subscription</p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Pet Personality Quiz */}
          <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-personality-quiz">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-question-circle text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cosmic Personality Quiz</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Discover your pet's cosmic personality type and get a personalized horoscope based on their celestial age.
              </p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-primary mr-2"></i>
                  Personality type analysis
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-primary mr-2"></i>
                  Cosmic horoscope
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-primary mr-2"></i>
                  Shareable results
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleFeatureClick("Cosmic Personality Quiz", 2)}
                data-testid="button-personality-quiz"
              >
                Start Quiz
                <Badge className="ml-2 bg-white/20">2 tokens</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* AR Experience */}
          <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-ar-filters">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-camera text-accent text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">AR Age Filters</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Transform your pet with augmented reality filters that show how they might look at different ages.
              </p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Puppy to senior filters
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Cosmic age visualization
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  Save & share videos
                </div>
              </div>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleFeatureClick("AR Age Filters", 3)}
                data-testid="button-ar-filters"
              >
                Try AR Filters
                <Badge className="ml-2 bg-white/20">3 tokens</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Timeline & Scrapbook */}
          <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-timeline">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-timeline text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Age Timeline</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create a beautiful timeline of your pet's life with photos, memories, and milestones.
              </p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-primary mr-2"></i>
                  Photo timeline
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-primary mr-2"></i>
                  Memory notes
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-primary mr-2"></i>
                  Milestone tracking
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => handleFeatureClick("Age Timeline", 1)}
                data-testid="button-timeline"
              >
                View Timeline
                <Badge className="ml-2 bg-white/20">1 token</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Cosmic Reports */}
          <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-cosmic-reports">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-cosmic-blue/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-star text-cosmic-blue text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Cosmic Reports</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Generate detailed cosmic age reports with beautiful visualizations and shareable graphics.
              </p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-cosmic-blue mr-2"></i>
                  Detailed cosmic calculations
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-cosmic-blue mr-2"></i>
                  Beautiful visualizations
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-cosmic-blue mr-2"></i>
                  Social media ready
                </div>
              </div>
              <Button 
                className="w-full bg-cosmic-blue hover:bg-cosmic-blue/90 text-white"
                onClick={() => handleFeatureClick("Cosmic Report", 1)}
                data-testid="button-cosmic-report"
              >
                Generate Report
                <Badge className="ml-2 bg-white/20">1 token</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Ad-Free Experience */}
          <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-ad-free">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-ad text-green-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ad-Free Experience</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Enjoy the app without any advertisements for a full month of uninterrupted pet tracking.
              </p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  No banner ads
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  No popup ads
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>
                  30 days duration
                </div>
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-500/90 text-white"
                onClick={() => handleFeatureClick("Ad-Free Experience", 2)}
                data-testid="button-ad-free"
              >
                Remove Ads
                <Badge className="ml-2 bg-white/20">2 tokens</Badge>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Analytics */}
          <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid="feature-analytics">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-chart-bar text-purple-500 text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Analytics</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get detailed insights into your pet's development patterns and health trends over time.
              </p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-purple-500 mr-2"></i>
                  Growth tracking charts
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-purple-500 mr-2"></i>
                  Health trend analysis
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-purple-500 mr-2"></i>
                  Milestone predictions
                </div>
              </div>
              <Button 
                className="w-full bg-purple-500 hover:bg-purple-500/90 text-white"
                onClick={() => handleFeatureClick("Premium Analytics", 2)}
                data-testid="button-analytics"
              >
                View Analytics
                <Badge className="ml-2 bg-white/20">2 tokens</Badge>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground">Get unlimited access to all premium features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Token Plan */}
          <Card className={`border-2 transition-all ${selectedPlan === 'tokens' ? 'border-accent' : 'border-border'}`} data-testid="plan-tokens">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Pay Per Use
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-coins text-accent"></i>
                </div>
              </CardTitle>
              <p className="text-muted-foreground">Perfect for occasional users</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="flex items-center text-sm">
                    <i className="fas fa-ad mr-2 text-primary"></i>
                    Ad-free experience
                  </span>
                  <span className="font-semibold text-sm">2 tokens/month</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="flex items-center text-sm">
                    <i className="fas fa-star mr-2 text-cosmic-purple"></i>
                    Cosmic report
                  </span>
                  <span className="font-semibold text-sm">1 token</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="flex items-center text-sm">
                    <i className="fas fa-camera mr-2 text-accent"></i>
                    Premium AR filters
                  </span>
                  <span className="font-semibold text-sm">3 tokens</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="flex items-center text-sm">
                    <i className="fas fa-question-circle mr-2 text-primary"></i>
                    Personality quiz
                  </span>
                  <span className="font-semibold text-sm">2 tokens</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">$1 <span className="text-lg font-normal">per token</span></div>
                <p className="text-sm text-muted-foreground">Buy as needed</p>
              </div>

              <Link href="/checkout?plan=tokens" className="block">
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setSelectedPlan('tokens')}
                  data-testid="button-buy-tokens"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Buy Tokens
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card className={`border-2 transition-all relative ${selectedPlan === 'subscription' ? 'border-primary' : 'border-border'}`} data-testid="plan-subscription">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Premium Unlimited
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-cosmic-blue rounded-full flex items-center justify-center">
                  <i className="fas fa-infinity text-white"></i>
                </div>
              </CardTitle>
              <p className="text-muted-foreground">Best value for active pet parents</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-background/50 rounded-lg">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-sm">Unlimited cosmic reports</span>
                </div>
                <div className="flex items-center p-3 bg-background/50 rounded-lg">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-sm">Ad-free experience</span>
                </div>
                <div className="flex items-center p-3 bg-background/50 rounded-lg">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-sm">Premium AR filters</span>
                </div>
                <div className="flex items-center p-3 bg-background/50 rounded-lg">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-sm">Priority meetup access</span>
                </div>
                <div className="flex items-center p-3 bg-background/50 rounded-lg">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-sm">Exclusive forums</span>
                </div>
                <div className="flex items-center p-3 bg-background/50 rounded-lg">
                  <i className="fas fa-check text-green-500 mr-3"></i>
                  <span className="text-sm">Premium analytics</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">$10 <span className="text-lg font-normal">/month</span></div>
                <p className="text-sm text-muted-foreground">Cancel anytime</p>
              </div>

              <Link href="/checkout?plan=subscription" className="block">
                <Button 
                  className="w-full"
                  onClick={() => setSelectedPlan('subscription')}
                  data-testid="button-subscribe"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Start Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Secure payments powered by Stripe • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
}
