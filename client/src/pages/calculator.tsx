import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalculateAge } from "@/hooks/use-pets";
import { useToast } from "@/hooks/use-toast";
import { formatAge, formatCosmicAge } from "@/lib/age-calculator";

interface AgeResult {
  ageInMilliseconds: number;
  ageInYears: number;
  ageInMonths: number;
  humanEquivalent: number;
  lifeStage: string;
  cosmic: {
    starLifecycle: number;
    galaxyFormation: number;
    universeAge: number;
  };
}

export default function Calculator() {
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sizeCategory, setSizeCategory] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);
  
  const calculateAge = useCalculateAge();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate || !sizeCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in birth date and size category",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await calculateAge.mutateAsync({ birthDate, sizeCategory });
      setResult(result);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate age. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getLifeStageColor = (stage: string) => {
    switch (stage) {
      case "Puppy": return "bg-accent/20 text-accent";
      case "Young Adult": return "bg-primary/20 text-primary";
      case "Adult": return "bg-green-500/20 text-green-500";
      case "Senior": return "bg-purple-500/20 text-purple-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="calculator-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pet Age Calculator</h1>
          <p className="text-xl text-muted-foreground">Precision calculations using veterinary formulas</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card data-testid="calculator-form">
            <CardHeader>
              <CardTitle>Enter Pet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="petName">Pet Name</Label>
                  <Input
                    id="petName"
                    placeholder="e.g., Buddy"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    data-testid="input-pet-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    placeholder="e.g., Golden Retriever"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    data-testid="input-breed"
                  />
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="sizeCategory">Size Category</Label>
                    <Select value={sizeCategory} onValueChange={setSizeCategory}>
                      <SelectTrigger data-testid="select-size-category">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer mb-6" data-testid="image-upload">
                    <i className="fas fa-camera text-3xl text-muted-foreground mb-2"></i>
                    <p className="text-muted-foreground">Upload pet photo</p>
                    <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to browse</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg" 
                  disabled={calculateAge.isPending}
                  data-testid="button-calculate"
                >
                  {calculateAge.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Calculate Age & Cosmic Journey
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10" data-testid="calculator-results">
            <CardContent className="p-6">
              {result ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <i className="fas fa-paw text-primary-foreground text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold" data-testid="result-pet-name">{petName || "Your Pet"}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLifeStageColor(result.lifeStage)}`} data-testid="result-life-stage">
                      {result.lifeStage}
                    </span>
                  </div>

                  {/* Age Results */}
                  <div className="space-y-4">
                    <Card className="bg-background/50 p-4" data-testid="result-age">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {formatAge(result.ageInYears, result.ageInMonths)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.ageInMilliseconds.toLocaleString()} milliseconds old
                      </div>
                    </Card>

                    <Card className="bg-background/50 p-4" data-testid="result-human-age">
                      <h4 className="font-semibold mb-2">Human Equivalent</h4>
                      <div className="text-xl font-bold text-accent">{result.humanEquivalent} years old</div>
                      <div className="text-sm text-muted-foreground">Based on {sizeCategory} breed formula</div>
                    </Card>

                    {/* Cosmic Age */}
                    <Card className="bg-gradient-to-r from-cosmic-purple/20 to-cosmic-blue/20 p-4" data-testid="result-cosmic-age">
                      <h4 className="font-semibold mb-3 flex items-center text-white">
                        <i className="fas fa-star mr-2 text-accent"></i>
                        Cosmic Journey
                      </h4>
                      <div className="space-y-2 text-sm text-white/90">
                        <div className="flex justify-between">
                          <span>⭐ Star Lifecycle:</span>
                          <span className="font-medium">{formatCosmicAge(result.cosmic.starLifecycle)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🌌 Galaxy Formation:</span>
                          <span className="font-medium">{formatCosmicAge(result.cosmic.galaxyFormation)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🌠 Universe Age:</span>
                          <span className="font-medium">{formatCosmicAge(result.cosmic.universeAge)}</span>
                        </div>
                      </div>
                    </Card>

                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-share-cosmic">
                      <i className="fas fa-share mr-2"></i>
                      Share Cosmic Age (1 Token)
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12" data-testid="no-results">
                  <i className="fas fa-calculator text-4xl text-muted-foreground mb-4"></i>
                  <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground">Enter your pet's details to see their age and cosmic journey</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
