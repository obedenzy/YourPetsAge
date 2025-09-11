import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pet } from "@shared/schema";
import { formatAge } from "@/lib/age-calculator";

interface ProfileCardProps {
  pet: Pet;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRecalculate?: () => void;
}

export default function ProfileCard({ pet, onView, onEdit, onDelete, onRecalculate }: ProfileCardProps) {
  const calculateAge = (birthDate: string) => {
    const now = new Date();
    const birth = new Date(birthDate);
    const ageInMs = now.getTime() - birth.getTime();
    const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
    const years = Math.floor(ageInYears);
    const months = Math.floor((ageInYears % 1) * 12);
    return { years, months };
  };

  const getLifeStage = (birthDate: string) => {
    const { years } = calculateAge(birthDate);
    if (years < 1) return "Puppy";
    if (years < 3) return "Young Adult";
    if (years < 7) return "Adult";
    return "Senior";
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

  const age = calculateAge(pet.birthDate);
  const lifeStage = getLifeStage(pet.birthDate);

  return (
    <Card className="hover:shadow-lg transition-all transform hover:scale-105" data-testid={`pet-card-${pet.id}`}>
      <CardContent className="p-6">
        {pet.imageUrl && (
          <img 
            src={pet.imageUrl} 
            alt={pet.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
            data-testid={`pet-image-${pet.id}`}
          />
        )}
        
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold mb-1" data-testid={`pet-name-${pet.id}`}>{pet.name}</h3>
            <p className="text-muted-foreground text-sm" data-testid={`pet-breed-${pet.id}`}>
              {pet.breed} • {formatAge(age.years, age.months)}
            </p>
          </div>
          <Badge className={getLifeStageColor(lifeStage)} data-testid={`pet-lifestage-${pet.id}`}>
            {lifeStage}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Born:</span>
              <span className="font-medium">{new Date(pet.birthDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium capitalize">{pet.sizeCategory}</span>
            </div>
          </div>
          {onRecalculate && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={onRecalculate}
              data-testid={`button-recalculate-${pet.id}`}
            >
              <i className="fas fa-sync-alt"></i>
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          {onView && (
            <Button className="flex-1" size="sm" onClick={onView} data-testid={`button-view-${pet.id}`}>
              View Profile
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} data-testid={`button-edit-${pet.id}`}>
              <i className="fas fa-edit"></i>
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} data-testid={`button-delete-${pet.id}`}>
              <i className="fas fa-trash"></i>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
