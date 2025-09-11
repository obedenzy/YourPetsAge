export interface PetKind {
  id: string;
  name: string;
  emoji: string;
  breeds: string[];
  sizeCategoryRequired: boolean;
}

export const PET_KINDS: PetKind[] = [
  {
    id: "dog",
    name: "Dog",
    emoji: "🐕",
    sizeCategoryRequired: true,
    breeds: [
      "Labrador Retriever",
      "Golden Retriever",
      "German Shepherd",
      "French Bulldog",
      "Bulldog",
      "Poodle",
      "Beagle",
      "Rottweiler",
      "German Shorthaired Pointer",
      "Yorkshire Terrier",
      "Dachshund",
      "Siberian Husky",
      "Boxer",
      "Boston Terrier",
      "Australian Shepherd",
      "Border Collie",
      "Cocker Spaniel",
      "Shih Tzu",
      "Chihuahua",
      "Great Dane",
      "Pomeranian",
      "Maltese",
      "Pug",
      "Bernese Mountain Dog",
      "Jack Russell Terrier",
      "Doberman Pinscher",
      "Mastiff",
      "Saint Bernard",
      "Weimaraner",
      "Basset Hound"
    ]
  },
  {
    id: "cat",
    name: "Cat",
    emoji: "🐱",
    sizeCategoryRequired: false,
    breeds: [
      "Persian",
      "Maine Coon",
      "British Shorthair",
      "Ragdoll",
      "Siamese",
      "American Shorthair",
      "Abyssinian",
      "Russian Blue",
      "Birman",
      "Norvegian Forest Cat",
      "Bengal",
      "Sphynx",
      "Scottish Fold",
      "Munchkin",
      "Oriental Shorthair",
      "Devon Rex",
      "Cornish Rex",
      "Turkish Angora",
      "Manx",
      "Bombay",
      "Egyptian Mau",
      "Savannah",
      "Siberian",
      "Balinese",
      "Burmese",
      "Chartreux",
      "Japanese Bobtail",
      "Somali",
      "Tonkinese",
      "Turkish Van"
    ]
  },
  {
    id: "bird",
    name: "Bird",
    emoji: "🐦",
    sizeCategoryRequired: true,
    breeds: [
      "Budgerigar (Parakeet)",
      "Cockatiel",
      "African Grey Parrot",
      "Macaw",
      "Cockatoo",
      "Conure",
      "Lovebird",
      "Canary",
      "Finch",
      "Amazon Parrot",
      "Eclectus Parrot",
      "Caique",
      "Quaker Parrot",
      "Pionus Parrot",
      "Senegal Parrot",
      "Meyer's Parrot",
      "Indian Ringneck",
      "Sun Conure",
      "Green Cheek Conure",
      "Blue Crown Conure",
      "Crimson Rosella",
      "Rainbow Lorikeet",
      "Galah",
      "Umbrella Cockatoo",
      "Moluccan Cockatoo"
    ]
  },
  {
    id: "rabbit",
    name: "Rabbit",
    emoji: "🐰",
    sizeCategoryRequired: true,
    breeds: [
      "Holland Lop",
      "Netherland Dwarf",
      "Lionhead",
      "Mini Rex",
      "English Angora",
      "Flemish Giant",
      "New Zealand",
      "Californian",
      "Dutch",
      "English Lop",
      "French Lop",
      "Mini Lop",
      "Rex",
      "Himalayan",
      "Jersey Wooly",
      "American Fuzzy Lop",
      "Polish",
      "Havana",
      "Silver",
      "Tan",
      "English Spot",
      "Checkered Giant",
      "Satin",
      "American",
      "Hotot"
    ]
  },
  {
    id: "hamster",
    name: "Hamster",
    emoji: "🐹",
    sizeCategoryRequired: false,
    breeds: [
      "Syrian (Golden) Hamster",
      "Roborovski Dwarf Hamster",
      "Campbell's Russian Dwarf Hamster",
      "Winter White Russian Dwarf Hamster",
      "Chinese Hamster",
      "European Hamster",
      "Turkish Hamster",
      "Romanian Hamster",
      "Ciscaucasian Hamster",
      "Georgian Hamster"
    ]
  },
  {
    id: "guinea-pig",
    name: "Guinea Pig",
    emoji: "🐹",
    sizeCategoryRequired: false,
    breeds: [
      "American",
      "Abyssinian",
      "Peruvian",
      "Silkie (Sheltie)",
      "Teddy",
      "Texel",
      "Coronet",
      "Alpaca",
      "Lunkarya",
      "Merino",
      "Rex",
      "Ridgeback",
      "Somali",
      "Swiss",
      "White Crested"
    ]
  },
  {
    id: "fish",
    name: "Fish",
    emoji: "🐠",
    sizeCategoryRequired: true,
    breeds: [
      "Betta (Siamese Fighting Fish)",
      "Goldfish",
      "Guppy",
      "Neon Tetra",
      "Angelfish",
      "Molly",
      "Platy",
      "Swordtail",
      "Zebra Danio",
      "Cherry Barb",
      "Tiger Barb",
      "Corydoras Catfish",
      "Discus",
      "Oscar",
      "Cichlid",
      "Rainbow Fish",
      "Killifish",
      "Gouramis",
      "Clownfish",
      "Tang",
      "Wrasse",
      "Grouper",
      "Cardinalfish",
      "Dottyback"
    ]
  },
  {
    id: "reptile",
    name: "Reptile",
    emoji: "🦎",
    sizeCategoryRequired: true,
    breeds: [
      "Bearded Dragon",
      "Leopard Gecko",
      "Blue-Tongued Skink",
      "Ball Python",
      "Corn Snake",
      "King Snake",
      "Boa Constrictor",
      "Red-Eared Slider Turtle",
      "Russian Tortoise",
      "Hermann's Tortoise",
      "Iguana",
      "Chameleon",
      "Crested Gecko",
      "Day Gecko",
      "Monitor Lizard",
      "Uromastyx",
      "Tegu",
      "Anole",
      "Skink",
      "Chinese Water Dragon"
    ]
  },
  {
    id: "ferret",
    name: "Ferret",
    emoji: "🦫",
    sizeCategoryRequired: false,
    breeds: [
      "Domestic Ferret",
      "Angora Ferret",
      "European Polecat",
      "Black-footed Ferret"
    ]
  },
  {
    id: "horse",
    name: "Horse",
    emoji: "🐴",
    sizeCategoryRequired: true,
    breeds: [
      "Arabian",
      "Thoroughbred",
      "Quarter Horse",
      "Paint Horse",
      "Appaloosa",
      "Morgan",
      "Tennessee Walking Horse",
      "Standardbred",
      "Mustang",
      "Friesian",
      "Clydesdale",
      "Percheron",
      "Belgian Draft",
      "Shire",
      "Andalusian",
      "Lipizzan",
      "Icelandic Horse",
      "Haflinger",
      "Welsh Pony",
      "Shetland Pony"
    ]
  }
];

export const getPetKindById = (id: string): PetKind | undefined => {
  return PET_KINDS.find(kind => kind.id === id);
};

export const getBreedsByKind = (kindId: string): string[] => {
  const kind = getPetKindById(kindId);
  return kind ? kind.breeds : [];
};

export const getSizeCategories = (kindId: string): { value: string; label: string }[] => {
  const kind = getPetKindById(kindId);
  if (!kind?.sizeCategoryRequired) {
    return [];
  }

  // Different size categories for different pet kinds
  switch (kindId) {
    case "dog":
    case "rabbit":
    case "horse":
      return [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" }
      ];
    case "bird":
      return [
        { value: "small", label: "Small (Finch, Canary)" },
        { value: "medium", label: "Medium (Cockatiel, Conure)" },
        { value: "large", label: "Large (Macaw, Cockatoo)" }
      ];
    case "fish":
      return [
        { value: "small", label: "Small (Under 3 inches)" },
        { value: "medium", label: "Medium (3-8 inches)" },
        { value: "large", label: "Large (Over 8 inches)" }
      ];
    case "reptile":
      return [
        { value: "small", label: "Small (Under 12 inches)" },
        { value: "medium", label: "Medium (1-3 feet)" },
        { value: "large", label: "Large (Over 3 feet)" }
      ];
    default:
      return [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" }
      ];
  }
};