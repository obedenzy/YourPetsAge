export interface CosmicAge {
  starLifecycle: number;
  galaxyFormation: number;
  universeAge: number;
}

export function calculateCosmicAge(ageInYears: number): CosmicAge {
  // Scale pet age to cosmic timescales
  // Assuming a pet's full lifespan (~15 years) represents different cosmic events
  
  const starLifecycle = (ageInYears / 15) * 10_000_000_000; // 10 billion years (main sequence star)
  const galaxyFormation = (ageInYears / 15) * 1_000_000_000; // 1 billion years (galaxy formation)
  const universeAge = (ageInYears / 15) * 13_800_000_000; // 13.8 billion years (age of universe)

  return {
    starLifecycle: Math.round(starLifecycle),
    galaxyFormation: Math.round(galaxyFormation),
    universeAge: Math.round(universeAge)
  };
}

export function generateCosmicReport(petName: string, age: number, cosmicAge: CosmicAge): string {
  const reports = [
    `🌟 ${petName} has experienced ${(cosmicAge.starLifecycle / 1_000_000_000).toFixed(2)} billion years of stellar evolution! That's like watching ${Math.floor(cosmicAge.starLifecycle / 100_000_000)} generations of stars being born and dying.`,
    
    `🌌 In galactic terms, ${petName} has witnessed ${(cosmicAge.galaxyFormation / 1_000_000_000).toFixed(2)} billion years of cosmic history. That's enough time for entire spiral arms to rotate around the galaxy!`,
    
    `🌠 From the universe's perspective, ${petName} represents ${((cosmicAge.universeAge / 13_800_000_000) * 100).toFixed(4)}% of all existence. Every moment with them is truly cosmic!`,
    
    `✨ If ${petName} were a star, they would be a ${getStarType(age)} - ${getStarDescription(age)}`,
  ];

  return reports.join('\n\n');
}

function getStarType(age: number): string {
  if (age < 1) return "Protostar";
  if (age < 3) return "Young Main Sequence Star";
  if (age < 7) return "Mature Main Sequence Star";
  return "Red Giant";
}

function getStarDescription(age: number): string {
  if (age < 1) return "full of potential energy, just beginning to shine";
  if (age < 3) return "burning bright with youthful energy and enthusiasm";
  if (age < 7) return "steady and reliable, providing consistent warmth and light";
  return "wise and experienced, entering a new phase of cosmic beauty";
}

export function createShareableCosmicImage(petName: string, age: number, cosmicAge: CosmicAge): string {
  // This would generate a shareable image with cosmic background and pet's cosmic age
  // For now, return a text-based shareable content
  return `🐾 ${petName}'s Cosmic Journey 🌟

Age: ${age} years
Cosmic Equivalent: ${(cosmicAge.universeAge / 1_000_000_000).toFixed(2)} billion years of universe time

#PetAgeTranslator #CosmicJourney #${petName}`;
}
