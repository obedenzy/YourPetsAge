import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalculateAge } from "@/hooks/use-pets";
import { useToast } from "@/hooks/use-toast";
import { formatAge, formatCosmicAge } from "@/lib/age-calculator";

interface AgeCalculatorProps {
  onResult?: (result: any) => void;
  petData?: {
    name?: string;
    breed?: string;
    birthDate?: string;
    sizeCategory?: string;
  };
}

export default function AgeCalculator({ onResult, petData }: AgeCalculatorProps) {
  const [petName, setPetName] = useState(petData?.name || "");
  const [breed, setBreed] = useState(petData?.breed || "");
  const [birthDate, setBirthDate] = useState(petData?.birthDate || "");
  const [sizeCategory, setSizeCategory] = useState(petData?.sizeCategory || "");
  
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
      onResult?.(result);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate age. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card data-testid="age-calculator">
      <CardHeader>
        <CardTitle>Pet Age Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button 
            type="submit" 
            className="w-full" 
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
                <i className="fas fa-calculator mr-2"></i>
                Calculate Age
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
