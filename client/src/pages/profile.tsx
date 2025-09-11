import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePets, useCreatePet, useDeletePet } from "@/hooks/use-pets";
import { useToast } from "@/hooks/use-toast";
import { formatAge } from "@/lib/age-calculator";
import { Link } from "wouter";

export default function Profile() {
  const { data: pets, isLoading } = usePets();
  const createPet = useCreatePet();
  const deletePet = useDeletePet();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleDeletePet = async (petId: string, petName: string) => {
    if (confirm(`Are you sure you want to delete ${petName}'s profile?`)) {
      try {
        await deletePet.mutateAsync(petId);
        toast({
          title: "Pet Deleted",
          description: `${petName}'s profile has been deleted.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete pet profile.",
          variant: "destructive",
        });
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]" data-testid="loading-spinner">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="profile-page">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Pet Profiles</h1>
            <p className="text-xl text-muted-foreground">Manage and track your furry family members</p>
          </div>
          <Link href="/calculator">
            <Button data-testid="button-add-pet">
              <i className="fas fa-plus mr-2"></i>
              Add New Pet
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets?.map((pet) => {
            const age = calculateAge(pet.birthDate);
            const lifeStage = getLifeStage(pet.birthDate);
            
            return (
              <Card key={pet.id} className="hover:shadow-lg transition-all transform hover:scale-105" data-testid={`pet-card-${pet.id}`}>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLifeStageColor(lifeStage)}`} data-testid={`pet-lifestage-${pet.id}`}>
                      {lifeStage}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Born:</span>
                        <span className="font-medium">{new Date(pet.birthDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium capitalize">{pet.sizeCategory}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      data-testid={`button-recalculate-${pet.id}`}
                    >
                      <i className="fas fa-sync-alt"></i>
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/pet-details/${pet.id}`} className="flex-1">
                      <Button className="w-full" size="sm" data-testid={`button-view-${pet.id}`}>
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePet(pet.id, pet.name)}
                      disabled={deletePet.isPending}
                      data-testid={`button-delete-${pet.id}`}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Pet Card */}
          <Card className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer min-h-[400px] flex flex-col items-center justify-center" data-testid="add-pet-card">
            <Link href="/calculator" className="w-full h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-plus text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Add New Pet</h3>
              <p className="text-muted-foreground text-sm">Create a profile for another furry friend</p>
            </Link>
          </Card>
        </div>

        {(!pets || pets.length === 0) && (
          <div className="text-center py-12" data-testid="no-pets-message">
            <i className="fas fa-paw text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No Pets Yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first pet profile</p>
            <Link href="/calculator">
              <Button>
                <i className="fas fa-plus mr-2"></i>
                Add Your First Pet
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
