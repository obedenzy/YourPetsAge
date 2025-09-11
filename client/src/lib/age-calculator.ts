export interface AgeCalculation {
  ageInMilliseconds: number;
  ageInYears: number;
  ageInMonths: number;
  ageInDays: number;
  ageInHours: number;
  ageInMinutes: number;
  ageInSeconds: number;
  humanEquivalent: number;
  lifeStage: string;
  cosmic: {
    starLifecycle: number;
    milkyWayFormation: number;
    universeAge: number;
  };
}

export interface RealTimeAge {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
}

export function calculatePetAge(birthDate: string, sizeCategory: 'small' | 'medium' | 'large'): AgeCalculation {
  const now = new Date();
  const birth = new Date(birthDate);
  const ageInMs = now.getTime() - birth.getTime();
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  
  // Veterinary age formulas based on breed size
  let humanEquivalent;
  if (sizeCategory === 'small') {
    humanEquivalent = ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 4.5;
  } else if (sizeCategory === 'large') {
    humanEquivalent = ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 7;
  } else { // medium
    humanEquivalent = ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 5.5;
  }

  // Life stage categorization
  let lifeStage;
  if (ageInYears < 1) {
    lifeStage = "Puppy";
  } else if (ageInYears < 3) {
    lifeStage = "Young Adult";
  } else if (ageInYears < 7) {
    lifeStage = "Adult";
  } else {
    lifeStage = "Senior";
  }

  // Cosmic age calculations
  const starLifecycle = (ageInYears / 15) * 10_000_000_000; // 10 billion years
  const milkyWayFormation = (ageInYears / 15) * 1_000_000_000; // 1 billion years (Milky Way formation)
  const universeAge = (ageInYears / 15) * 13_800_000_000; // 13.8 billion years

  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  const ageInHours = Math.floor(ageInMs / (1000 * 60 * 60));
  const ageInMinutes = Math.floor(ageInMs / (1000 * 60));
  const ageInSeconds = Math.floor(ageInMs / 1000);

  return {
    ageInMilliseconds: ageInMs,
    ageInYears: Math.floor(ageInYears),
    ageInMonths: Math.floor((ageInYears % 1) * 12),
    ageInDays,
    ageInHours,
    ageInMinutes,
    ageInSeconds,
    humanEquivalent: Math.round(humanEquivalent),
    lifeStage,
    cosmic: {
      starLifecycle: Math.round(starLifecycle),
      milkyWayFormation: Math.round(milkyWayFormation),
      universeAge: Math.round(universeAge)
    }
  };
}

export function formatAge(ageInYears: number, ageInMonths: number): string {
  if (ageInYears === 0) {
    return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
  }
  if (ageInMonths === 0) {
    return `${ageInYears} year${ageInYears !== 1 ? 's' : ''}`;
  }
  return `${ageInYears} year${ageInYears !== 1 ? 's' : ''}, ${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
}

export function formatCosmicAge(age: number): string {
  if (age >= 1_000_000_000) {
    return `${(age / 1_000_000_000).toFixed(1)} billion years`;
  }
  if (age >= 1_000_000) {
    return `${(age / 1_000_000).toFixed(1)} million years`;
  }
  if (age >= 1_000) {
    return `${(age / 1_000).toFixed(1)} thousand years`;
  }
  return `${age.toFixed(0)} years`;
}

export function calculateRealTimeAge(birthDate: string): RealTimeAge {
  const now = new Date();
  const birth = new Date(birthDate);
  const totalMilliseconds = now.getTime() - birth.getTime();
  
  const years = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalMilliseconds
  };
}

export function formatRealTimeAge(age: RealTimeAge): string {
  return `${age.years}y ${age.months}m ${age.days}d ${age.hours}h ${age.minutes}min ${age.seconds}s ${age.milliseconds}ms`;
}

export function getPetAgeFormula(petKind: string, ageInYears: number, sizeCategory: string): number {
  switch (petKind) {
    case "dog":
      if (sizeCategory === 'small') {
        return ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 4.5;
      } else if (sizeCategory === 'large') {
        return ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 7;
      } else { // medium
        return ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 5.5;
      }
    case "cat":
      return ageInYears < 2 ? ageInYears * 12 : 24 + (ageInYears - 2) * 4;
    case "rabbit":
      return ageInYears * 8; // General rabbit age formula
    case "bird":
      if (sizeCategory === 'small') {
        return ageInYears * 9; // Small birds
      } else if (sizeCategory === 'large') {
        return ageInYears * 5; // Large birds like parrots
      } else {
        return ageInYears * 7; // Medium birds
      }
    case "hamster":
    case "guinea-pig":
      return ageInYears * 25; // Small rodents age quickly
    case "fish":
      return ageInYears * 5; // General fish age formula
    case "reptile":
      return ageInYears * 3; // Reptiles age slowly
    case "ferret":
      return ageInYears * 7; // Similar to cats
    case "horse":
      return ageInYears < 4 ? ageInYears * 6.5 : 26 + (ageInYears - 4) * 2.5;
    default:
      return ageInYears * 7; // Default multiplier
  }
}
