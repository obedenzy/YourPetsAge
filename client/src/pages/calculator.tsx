import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Clock, Star, Timer, Heart, Users, ShoppingBag, Sparkles, Calculator as CalcIcon, Shield, Utensils, MapPin, TrendingUp, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { calculatePetAge, formatAge, formatCosmicAge, calculateRealTimeAge, formatRealTimeAge } from "@/lib/age-calculator";
import type { AgeCalculation, RealTimeAge } from "@/lib/age-calculator";
import { PET_KINDS, getBreedsByKind } from "@/lib/pet-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Famous pets data
const FAMOUS_PETS = {
  0: [{ name: "Newborn puppies/kittens", description: "Just like newborn pet babies taking their first breaths" }],
  1: [{ name: "Grumpy Cat", description: "Famous internet sensation cat (lived 7 years)" }],
  2: [{ name: "Boo the Pomeranian", description: "World's cutest dog social media star" }],
  3: [{ name: "Maru the Cat", description: "Famous Japanese box-loving cat" }],
  5: [{ name: "Lassie", description: "Famous Rough Collie from TV and movies" }],
  8: [{ name: "Beethoven", description: "Famous St. Bernard from the movies" }],
  10: [{ name: "Marley", description: "From 'Marley & Me' - lived 13 years" }],
  15: [{ name: "Oldest recorded dogs", description: "Like Bluey the Australian Cattle Dog" }]
};

// Famous people data
const FAMOUS_PEOPLE = {
  16: [{ name: "Greta Thunberg", description: "Climate activist" }],
  25: [{ name: "Taylor Swift", description: "Singer-songwriter" }],
  30: [{ name: "Mark Zuckerberg", description: "Facebook founder" }],
  40: [{ name: "Elon Musk", description: "Tesla/SpaceX CEO" }],
  50: [{ name: "Jennifer Lopez", description: "Singer and actress" }],
  60: [{ name: "Barack Obama", description: "Former US President" }],
  70: [{ name: "Bill Gates", description: "Microsoft founder" }],
  80: [{ name: "Warren Buffett", description: "Investor and philanthropist" }]
};

// Product suggestions by age and type
const getProductSuggestions = (ageInYears: number, petKind: string) => {
  const suggestions = [];
  
  if (ageInYears < 1) {
    suggestions.push(
      { name: "Puppy/Kitten Milk Formula", category: "Nutrition" },
      { name: "Soft Training Toys", category: "Toys" },
      { name: "Teething Chews", category: "Health" }
    );
  } else if (ageInYears < 3) {
    suggestions.push(
      { name: "High-Energy Adult Food", category: "Nutrition" },
      { name: "Interactive Puzzle Toys", category: "Toys" },
      { name: "Training Treats", category: "Training" }
    );
  } else if (ageInYears < 7) {
    suggestions.push(
      { name: "Premium Adult Food", category: "Nutrition" },
      { name: "Durable Chew Toys", category: "Toys" },
      { name: "Dental Care Products", category: "Health" }
    );
  } else {
    suggestions.push(
      { name: "Senior Pet Food", category: "Nutrition" },
      { name: "Joint Support Supplements", category: "Health" },
      { name: "Orthopedic Bed", category: "Comfort" }
    );
  }
  
  return suggestions;
};

export default function Calculator() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [petKind, setPetKind] = useState<string>("dog");
  const [breed, setBreed] = useState("");
  const [sizeCategory, setSizeCategory] = useState<'small' | 'medium' | 'large'>('medium');
  const [ageResult, setAgeResult] = useState<AgeCalculation | null>(null);
  const [realTimeAge, setRealTimeAge] = useState<RealTimeAge | null>(null);
  const [error, setError] = useState("");
  const [showCreateMeetupForm, setShowCreateMeetupForm] = useState(false);
  const [meetupTitle, setMeetupTitle] = useState("");
  const [meetupDate, setMeetupDate] = useState("");
  const [meetupLocation, setMeetupLocation] = useState("");
  const [meetupAgeGroup, setMeetupAgeGroup] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Data queries for additional sections
  const { data: healthSuggestions } = useQuery({
    queryKey: ["/api/health/suggestions"],
    enabled: !!ageResult
  });

  const { data: vets } = useQuery({
    queryKey: ["/api/vets/nearby"],
    enabled: !!ageResult
  });

  const { data: famousEquivalents } = useQuery({
    queryKey: ["/api/famous-equivalents", ageResult?.humanEquivalent?.toString()],
    enabled: !!ageResult
  });

  const { data: communityTrends } = useQuery({
    queryKey: ["/api/community/trends"],
    enabled: !!ageResult
  });

  const { data: meetups } = useQuery({
    queryKey: ["/api/meetups"],
    enabled: !!ageResult
  });
  
  // Real-time age updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (birthDate && ageResult) {
      interval = setInterval(() => {
        setRealTimeAge(calculateRealTimeAge(birthDate));
      }, 100); // Update every 100ms for smooth millisecond updates
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [birthDate, ageResult]);
  
  const calculateMutation = useMutation({
    mutationFn: async (data: { birthDate: string; sizeCategory: string; petKind: string; name?: string; breed?: string }) => {
      const response = await fetch("/api/calculate-age", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to calculate age");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAgeResult(data);
      setRealTimeAge(calculateRealTimeAge(birthDate));
      setError("");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to calculate age");
      setAgeResult(null);
      setRealTimeAge(null);
    }
  });

  const createMeetupMutation = useMutation({
    mutationFn: async (meetupData: any) => {
      const response = await fetch("/api/meetups", {
        method: "POST",
        body: JSON.stringify(meetupData),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create meetup");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetups"] });
      setShowCreateMeetupForm(false);
      setMeetupTitle("");
      setMeetupDate("");
      setMeetupLocation("");
      setMeetupAgeGroup("");
      toast({
        title: "Meetup Created",
        description: "Your meetup has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create meetup",
        variant: "destructive",
      });
    }
  });

  const joinMeetupMutation = useMutation({
    mutationFn: async (meetupId: string) => {
      const response = await fetch(`/api/meetups/${meetupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join meetup");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetups"] });
      toast({
        title: "Joined Meetup",
        description: "You've successfully joined the meetup!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join meetup",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate) {
      setError("Please enter your pet's birth date");
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    if (birth > today) {
      setError("Birth date cannot be in the future");
      return;
    }

    calculateMutation.mutate({
      birthDate,
      sizeCategory,
      petKind,
      name: name || undefined,
      breed: breed || undefined
    });
  };

  const handleCreateMeetup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetupTitle || !meetupDate || !meetupLocation || !meetupAgeGroup) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createMeetupMutation.mutate({
      title: meetupTitle,
      date: new Date(meetupDate),
      location: meetupLocation,
      ageGroup: meetupAgeGroup,
      description: `Meetup for ${meetupAgeGroup} pets`,
      maxAttendees: 10,
      attendees: [],
    });
  };

  // Get available breeds for selected pet kind
  const availableBreeds = getBreedsByKind(petKind);
  
  // Auto-populate function for pet profiles
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const autoName = searchParams.get('name');
    const autoBirthDate = searchParams.get('birthDate');
    const autoBreed = searchParams.get('breed');
    const autoKind = searchParams.get('kind');
    const autoSize = searchParams.get('size');
    
    if (autoName) setName(autoName);
    if (autoBirthDate) setBirthDate(autoBirthDate);
    if (autoBreed) setBreed(autoBreed);
    if (autoKind) setPetKind(autoKind);
    if (autoSize && ['small', 'medium', 'large'].includes(autoSize)) {
      setSizeCategory(autoSize as 'small' | 'medium' | 'large');
    }
    
    // Auto-calculate if all required fields are present
    if (autoBirthDate && autoKind) {
      setTimeout(() => {
        calculateMutation.mutate({
          birthDate: autoBirthDate,
          sizeCategory: autoSize as 'small' | 'medium' | 'large' || 'medium',
          petKind: autoKind,
          name: autoName || undefined,
          breed: autoBreed || undefined
        });
      }, 500);
    }
  }, []);
  
  const getFamousPets = (age: number) => {
    const exactMatch = FAMOUS_PETS[age as keyof typeof FAMOUS_PETS];
    if (exactMatch) return exactMatch;
    
    // Find closest age
    const ages = Object.keys(FAMOUS_PETS).map(Number).sort((a, b) => Math.abs(age - a) - Math.abs(age - b));
    return FAMOUS_PETS[ages[0] as keyof typeof FAMOUS_PETS] || [];
  };
  
  const getFamousPeople = (humanAge: number) => {
    const exactMatch = FAMOUS_PEOPLE[humanAge as keyof typeof FAMOUS_PEOPLE];
    if (exactMatch) return exactMatch;
    
    // Find closest age
    const ages = Object.keys(FAMOUS_PEOPLE).map(Number).sort((a, b) => Math.abs(humanAge - a) - Math.abs(humanAge - b));
    return FAMOUS_PEOPLE[ages[0] as keyof typeof FAMOUS_PEOPLE] || [];
  };

  const getLifeStageColor = (stage: string) => {
    switch (stage) {
      case "Puppy":
      case "Kitten": 
      case "Young": return "bg-accent/20 text-accent";
      case "Young Adult": return "bg-primary/20 text-primary";
      case "Adult": return "bg-green-500/20 text-green-500";
      case "Senior": return "bg-purple-500/20 text-purple-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900" data-testid="calculator-page">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CalcIcon className="inline-block mr-3 h-12 w-12 text-primary" />
            Pet Age Calculator
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Precision calculations with real-time updates, cosmic insights, and personalized recommendations
          </motion.p>
        </div>

        {/* Calculator Form Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card data-testid="calculator-form" className="bg-white dark:bg-gray-800 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="mr-2 h-6 w-6 text-primary" />
                Enter Pet Details
              </CardTitle>
              <CardDescription>Tell us about your beloved companion</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" data-testid="error-alert">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Pet Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Buddy, Luna, Charlie"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="input-pet-name"
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="petKind">Pet Type</Label>
                    <Select value={petKind} onValueChange={setPetKind}>
                      <SelectTrigger data-testid="select-pet-kind">
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PET_KINDS.map((kind) => (
                          <SelectItem key={kind.id} value={kind.id}>
                            {kind.emoji} {kind.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Select value={breed} onValueChange={setBreed}>
                      <SelectTrigger data-testid="select-breed">
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBreeds.map((breedName) => (
                          <SelectItem key={breedName} value={breedName}>
                            {breedName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sizeCategory">Size Category</Label>
                    <Select value={sizeCategory} onValueChange={(value) => setSizeCategory(value as 'small' | 'medium' | 'large')}>
                      <SelectTrigger data-testid="select-size-category">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt; 25 lbs)</SelectItem>
                        <SelectItem value="medium">Medium (25-60 lbs)</SelectItem>
                        <SelectItem value="large">Large (&gt; 60 lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      data-testid="input-birth-date"
                      className="text-lg"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" 
                  disabled={calculateMutation.isPending}
                  data-testid="button-calculate"
                >
                  {calculateMutation.isPending ? (
                    <>
                      <Timer className="animate-spin mr-2 h-5 w-5" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Calculate Age & Cosmic Journey
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Sections - Only show when ageResult exists */}
        {ageResult && realTimeAge && (
          <div ref={resultsRef} className="space-y-8">
            {/* Pet Header Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">{PET_KINDS.find(k => k.id === petKind)?.emoji || "🐾"}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-2" data-testid="result-pet-name">{name || "Your Pet"}</h3>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getLifeStageColor(ageResult.lifeStage)}`} data-testid="result-life-stage">
                    {ageResult.lifeStage}
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            {/* Real-time Age Display Row */}
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20" data-testid="real-time-age">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="mr-2 h-5 w-5 text-blue-500" />
                  Live Age Counter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                  <div>
                    <div className="font-bold text-2xl">{realTimeAge.years}</div>
                    <div className="text-muted-foreground text-sm">Years</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">{realTimeAge.months}</div>
                    <div className="text-muted-foreground text-sm">Months</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">{realTimeAge.days}</div>
                    <div className="text-muted-foreground text-sm">Days</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">{realTimeAge.hours}</div>
                    <div className="text-muted-foreground text-sm">Hours</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">{realTimeAge.minutes}</div>
                    <div className="text-muted-foreground text-sm">Minutes</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">{realTimeAge.seconds}</div>
                    <div className="text-muted-foreground text-sm">Seconds</div>
                  </div>
                </div>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  {realTimeAge.milliseconds} milliseconds
                </div>
              </CardContent>
            </Card>

            {/* Age Comparison Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-primary/10" data-testid="pet-age-card">
                <CardHeader>
                  <CardTitle className="text-primary">Pet Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatAge(ageResult.ageInYears, ageResult.ageInMonths)}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {ageResult.ageInDays.toLocaleString()} days old
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-accent/10" data-testid="human-age-card">
                <CardHeader>
                  <CardTitle className="text-accent">Human Equivalent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ageResult.humanEquivalent} years</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Based on {petKind} & {sizeCategory} breed
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Cosmic Age Row */}
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20" data-testid="cosmic-age-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Cosmic Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="font-semibold">Star Lifecycle</div>
                    <div className="text-sm text-muted-foreground">{formatCosmicAge(ageResult.cosmic.starLifecycle)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌌</div>
                    <div className="font-semibold">Milky Way Formation</div>
                    <div className="text-sm text-muted-foreground">{formatCosmicAge(ageResult.cosmic.milkyWayFormation)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌠</div>
                    <div className="font-semibold">Universe Age</div>
                    <div className="text-sm text-muted-foreground">{formatCosmicAge(ageResult.cosmic.universeAge)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Recommendations Row */}
            {healthSuggestions && (
              <Card className="bg-red-500/10" data-testid="health-recommendations">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <Heart className="mr-2 h-5 w-5" />
                    Health Recommendations
                  </CardTitle>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Medical Disclaimer</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          This information is not veterinary advice. Always consult with a qualified veterinarian.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-background/50 p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                        Age-Based Checkups
                      </h4>
                      <div className="space-y-2">
                        {healthSuggestions?.checkups?.map((checkup: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{checkup.title}</span>
                            <Badge variant={checkup.status === 'completed' ? 'default' : 'secondary'}>
                              {checkup.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="bg-background/50 p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-accent" />
                        Preventive Care
                      </h4>
                      <div className="space-y-1 text-sm">
                        {healthSuggestions?.preventiveCare?.map((care: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>{care}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="bg-background/50 p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Utensils className="mr-2 h-4 w-4 text-primary" />
                        Nutrition Guidelines
                      </h4>
                      <div className="space-y-1 text-sm">
                        {healthSuggestions?.nutrition?.map((guideline: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span>{guideline}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Famous Equivalents Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-orange-500/10" data-testid="famous-pets-section">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <Users className="mr-2 h-5 w-5" />
                    Famous Pets at This Age
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getFamousPets(ageResult.ageInYears).map((pet, index) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-3">
                      <div className="font-medium">{pet.name}</div>
                      <div className="text-sm text-muted-foreground">{pet.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-green-500/10" data-testid="famous-people-section">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <Star className="mr-2 h-5 w-5" />
                    Famous People at Human Equivalent Age
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getFamousPeople(ageResult.humanEquivalent).map((person, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-3">
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-muted-foreground">{person.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Nearby Veterinarians Row */}
            {vets && (
              <Card className="bg-blue-500/10" data-testid="vet-finder">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    Nearby Veterinarians
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vets.slice(0, 3).map((vet: any) => (
                    <Card key={vet.id} className="border border-border hover:border-primary/50 transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{vet.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-accent" />
                            <span className="text-sm">{vet.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{vet.address}</p>
                        <p className="text-xs text-muted-foreground mb-3">{vet.distance}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">Call</Button>
                          <Button size="sm" variant="outline" className="flex-1">Directions</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Community Trends Row */}
            {communityTrends && (
              <Card className="bg-purple-500/10" data-testid="community-trends">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Community Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Popular Foods</h4>
                      <div className="space-y-2">
                        {communityTrends?.popularFoods?.map((food: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>🥘 {food.name}</span>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Activity Trends</h4>
                      <div className="space-y-2">
                        {communityTrends?.activities?.map((activity: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Local Meetups Row */}
            {meetups && (
              <Card className="bg-cyan-500/10" data-testid="community-meetups">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    Local Meetups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {meetups.slice(0, 3).map((meetup: any) => (
                      <Card key={meetup.id} className="border border-border hover:border-primary/50 transition-all">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{meetup.title}</h4>
                            <Badge variant="secondary">{meetup.ageGroup}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{meetup.location}</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {new Date(meetup.date).toLocaleDateString()}
                          </p>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => joinMeetupMutation.mutate(meetup.id)}
                            disabled={joinMeetupMutation.isPending}
                          >
                            Join Meetup
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Create Meetup Section */}
                  <div className="border-t pt-4">
                    {!showCreateMeetupForm ? (
                      <Button 
                        onClick={() => setShowCreateMeetupForm(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Meetup
                      </Button>
                    ) : (
                      <form onSubmit={handleCreateMeetup} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="meetupTitle">Meetup Title</Label>
                            <Input
                              id="meetupTitle"
                              placeholder="Young Adult Dog Playdate"
                              value={meetupTitle}
                              onChange={(e) => setMeetupTitle(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="meetupDate">Date & Time</Label>
                            <Input
                              id="meetupDate"
                              type="datetime-local"
                              value={meetupDate}
                              onChange={(e) => setMeetupDate(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="meetupLocation">Location</Label>
                            <Input
                              id="meetupLocation"
                              placeholder="Central Park Dog Run"
                              value={meetupLocation}
                              onChange={(e) => setMeetupLocation(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="meetupAgeGroup">Age Group</Label>
                            <Select value={meetupAgeGroup} onValueChange={setMeetupAgeGroup}>
                              <SelectTrigger>
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
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            type="submit" 
                            className="flex-1" 
                            disabled={createMeetupMutation.isPending}
                          >
                            {createMeetupMutation.isPending ? "Creating..." : "Create Meetup"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowCreateMeetupForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Suggestions Row */}
            <Card className="bg-blue-500/10" data-testid="product-suggestions-section">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Recommended Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getProductSuggestions(ageResult.ageInYears, petKind).map((product, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <ShoppingBag className="h-6 w-6 text-primary" />
                          </div>
                          <h4 className="font-medium mb-2">{product.name}</h4>
                          <Badge variant="secondary" className="mb-3">{product.category}</Badge>
                          <Button size="sm" className="w-full" data-testid={`product-buy-${index}`}>
                            View Product
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Products from Community Row */}
            {communityTrends?.recommendedProducts && (
              <Card className="bg-emerald-500/10" data-testid="community-recommended-products">
                <CardHeader>
                  <CardTitle className="flex items-center text-emerald-600">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Community Recommended Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {communityTrends.recommendedProducts.map((product: any, index: number) => (
                      <Card key={index} className="hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                              <ShoppingBag className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-medium text-sm mb-2">{product.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">Recommended for your pet's age</p>
                            <p className="text-sm font-semibold text-accent mb-3">{product.price}</p>
                            <Button size="sm" variant="outline" className="w-full">
                              View on Amazon
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share Button Row */}
            <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
              <CardContent className="p-6 text-center">
                <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90" data-testid="button-share-cosmic">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Share Cosmic Age (1 Token)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results Message */}
        {!ageResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-accent/20">
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <CalcIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground">Enter your pet's details to discover their age, cosmic journey, health recommendations, community insights, and local meetups</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}