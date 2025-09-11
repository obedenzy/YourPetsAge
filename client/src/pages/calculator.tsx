import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Calendar, Clock, Star, Timer, Heart, Users, ShoppingBag, Sparkles, Calculator as CalcIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { calculatePetAge, formatAge, formatCosmicAge, calculateRealTimeAge, formatRealTimeAge } from "@/lib/age-calculator";
import type { AgeCalculation, RealTimeAge } from "@/lib/age-calculator";
import { PET_KINDS, getBreedsByKind } from "@/lib/pet-data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  const resultsRef = useRef<HTMLDivElement>(null);
  
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
      <div className="max-w-7xl mx-auto">
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
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

          {/* Results Display */}
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-accent/20" data-testid="calculator-results">
              <CardContent className="p-6">
                {ageResult && realTimeAge ? (
                  <div className="space-y-6">
                    {/* Pet Header */}
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl">{PET_KINDS.find(k => k.id === petKind)?.emoji || "🐾"}</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-2" data-testid="result-pet-name">{name || "Your Pet"}</h3>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getLifeStageColor(ageResult.lifeStage)}`} data-testid="result-life-stage">
                        {ageResult.lifeStage}
                      </span>
                    </div>

                    {/* Real-time Age Display */}
                    <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4" data-testid="real-time-age">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Timer className="mr-2 h-5 w-5 text-blue-500" />
                        Live Age Counter
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                          <div className="font-bold text-lg">{realTimeAge.years}</div>
                          <div className="text-muted-foreground">Years</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{realTimeAge.months}</div>
                          <div className="text-muted-foreground">Months</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{realTimeAge.days}</div>
                          <div className="text-muted-foreground">Days</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{realTimeAge.hours}</div>
                          <div className="text-muted-foreground">Hours</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{realTimeAge.minutes}</div>
                          <div className="text-muted-foreground">Minutes</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{realTimeAge.seconds}</div>
                          <div className="text-muted-foreground">Seconds</div>
                        </div>
                      </div>
                      <div className="text-center mt-3 text-xs text-muted-foreground">
                        {realTimeAge.milliseconds} milliseconds
                      </div>
                    </Card>

                    {/* Side-by-side Age Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-primary/10 p-4" data-testid="pet-age-card">
                        <h4 className="font-semibold mb-2 text-primary">Pet Age</h4>
                        <div className="text-2xl font-bold">{formatAge(ageResult.ageInYears, ageResult.ageInMonths)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {ageResult.ageInDays.toLocaleString()} days old
                        </div>
                      </Card>
                      
                      <Card className="bg-accent/10 p-4" data-testid="human-age-card">
                        <h4 className="font-semibold mb-2 text-accent">Human Equivalent</h4>
                        <div className="text-2xl font-bold">{ageResult.humanEquivalent} years</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Based on {petKind} & {sizeCategory} breed
                        </div>
                      </Card>
                    </div>

                    {/* Enhanced Cosmic Age */}
                    <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4" data-testid="cosmic-age-card">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-500" />
                        Cosmic Journey
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">⭐ Star Lifecycle</span>
                          <span className="font-medium">{formatCosmicAge(ageResult.cosmic.starLifecycle)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">🌌 Milky Way Formation</span>
                          <span className="font-medium">{formatCosmicAge(ageResult.cosmic.milkyWayFormation)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">🌠 Universe Age</span>
                          <span className="font-medium">{formatCosmicAge(ageResult.cosmic.universeAge)}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Famous Pets Section */}
                    <Card className="bg-orange-500/10 p-4" data-testid="famous-pets-section">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Users className="mr-2 h-5 w-5 text-orange-500" />
                        Famous Pets at This Age
                      </h4>
                      <div className="space-y-2">
                        {getFamousPets(ageResult.ageInYears).map((pet, index) => (
                          <div key={index} className="border-l-4 border-orange-500 pl-3">
                            <div className="font-medium">{pet.name}</div>
                            <div className="text-sm text-muted-foreground">{pet.description}</div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Famous People Section */}
                    <Card className="bg-green-500/10 p-4" data-testid="famous-people-section">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-green-500" />
                        Famous People at Human Equivalent Age
                      </h4>
                      <div className="space-y-2">
                        {getFamousPeople(ageResult.humanEquivalent).map((person, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-3">
                            <div className="font-medium">{person.name}</div>
                            <div className="text-sm text-muted-foreground">{person.description}</div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Product Suggestions */}
                    <Card className="bg-blue-500/10 p-4" data-testid="product-suggestions-section">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5 text-blue-500" />
                        Recommended Products
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {getProductSuggestions(ageResult.ageInYears, petKind).map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-background/50 rounded">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.category}</div>
                            </div>
                            <Button size="sm" variant="outline" data-testid={`product-buy-${index}`}>
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Button className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90" data-testid="button-share-cosmic">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Share Cosmic Age (1 Token)
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="no-results">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                    >
                      <CalcIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                    <p className="text-muted-foreground">Enter your pet's details to discover their age, cosmic journey, and personalized insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}