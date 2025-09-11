import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPetSchema, insertMeetupSchema, insertForumPostSchema, insertTimelineSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      // Mock current user
      const user = await storage.getUser("user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/user/tokens", async (req, res) => {
    try {
      const { tokens } = req.body;
      const user = await storage.updateUserTokens("user-1", tokens);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pet routes
  app.get("/api/pets", async (req, res) => {
    try {
      const pets = await storage.getPetsByUserId("user-1");
      res.json(pets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/pets/:id", async (req, res) => {
    try {
      const pet = await storage.getPet(req.params.id);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.json(pet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/pets", async (req, res) => {
    try {
      const validation = insertPetSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid pet data", errors: validation.error.issues });
      }
      
      const petData = { ...validation.data, userId: "user-1" };
      const pet = await storage.createPet(petData);
      res.json(pet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/pets/:id", async (req, res) => {
    try {
      const pet = await storage.updatePet(req.params.id, req.body);
      res.json(pet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const success = await storage.deletePet(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Pet not found" });
      }
      res.json({ message: "Pet deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Age calculation endpoint
  app.post("/api/calculate-age", async (req, res) => {
    try {
      const { birthDate, sizeCategory, petKind = "dog" } = req.body;
      
      if (!birthDate) {
        return res.status(400).json({ message: "Birth date is required" });
      }

      const now = new Date();
      const birth = new Date(birthDate);
      const ageInMs = now.getTime() - birth.getTime();
      const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
      
      // Enhanced age calculations
      const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
      const ageInHours = Math.floor(ageInMs / (1000 * 60 * 60));
      const ageInMinutes = Math.floor(ageInMs / (1000 * 60));
      const ageInSeconds = Math.floor(ageInMs / 1000);
      
      // Pet-specific age formulas
      let humanEquivalent;
      switch (petKind) {
        case "dog":
          if (sizeCategory === 'small') {
            humanEquivalent = ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 4.5;
          } else if (sizeCategory === 'large') {
            humanEquivalent = ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 7;
          } else { // medium
            humanEquivalent = ageInYears < 2 ? ageInYears * 12.5 : 24 + (ageInYears - 2) * 5.5;
          }
          break;
        case "cat":
          humanEquivalent = ageInYears < 2 ? ageInYears * 12 : 24 + (ageInYears - 2) * 4;
          break;
        case "rabbit":
          humanEquivalent = ageInYears * 8;
          break;
        case "bird":
          if (sizeCategory === 'small') {
            humanEquivalent = ageInYears * 9;
          } else if (sizeCategory === 'large') {
            humanEquivalent = ageInYears * 5;
          } else {
            humanEquivalent = ageInYears * 7;
          }
          break;
        case "hamster":
        case "guinea-pig":
          humanEquivalent = ageInYears * 25;
          break;
        case "fish":
          humanEquivalent = ageInYears * 5;
          break;
        case "reptile":
          humanEquivalent = ageInYears * 3;
          break;
        case "ferret":
          humanEquivalent = ageInYears * 7;
          break;
        case "horse":
          humanEquivalent = ageInYears < 4 ? ageInYears * 6.5 : 26 + (ageInYears - 4) * 2.5;
          break;
        default:
          humanEquivalent = ageInYears * 7;
      }

      // Life stage categorization (varies by pet type)
      let lifeStage;
      if (petKind === "dog" || petKind === "cat") {
        if (ageInYears < 1) {
          lifeStage = petKind === "dog" ? "Puppy" : "Kitten";
        } else if (ageInYears < 3) {
          lifeStage = "Young Adult";
        } else if (ageInYears < 7) {
          lifeStage = "Adult";
        } else {
          lifeStage = "Senior";
        }
      } else {
        // Generic life stages for other pets
        if (ageInYears < 1) {
          lifeStage = "Young";
        } else if (ageInYears < 3) {
          lifeStage = "Adult";
        } else {
          lifeStage = "Senior";
        }
      }

      // Enhanced cosmic age calculations with Milky Way
      const starLifecycle = (ageInYears / 15) * 10_000_000_000; // 10 billion years
      const milkyWayFormation = (ageInYears / 15) * 1_000_000_000; // 1 billion years (Milky Way formation)
      const universeAge = (ageInYears / 15) * 13_800_000_000; // 13.8 billion years

      const result = {
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

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Meetup routes
  app.get("/api/meetups", async (req, res) => {
    try {
      const meetups = await storage.getMeetups();
      res.json(meetups);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/meetups", async (req, res) => {
    try {
      const validation = insertMeetupSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid meetup data", errors: validation.error.issues });
      }
      
      const meetupData = { ...validation.data, organizerId: "user-1" };
      const meetup = await storage.createMeetup(meetupData);
      res.json(meetup);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/meetups/:id/join", async (req, res) => {
    try {
      const success = await storage.joinMeetup(req.params.id, "user-1");
      if (!success) {
        return res.status(404).json({ message: "Meetup not found" });
      }
      res.json({ message: "Successfully joined meetup" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Forum routes
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const category = req.query.category as string;
      const posts = await storage.getForumPosts(category);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      const validation = insertForumPostSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid post data", errors: validation.error.issues });
      }
      
      const postData = { ...validation.data, authorId: "user-1" };
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts/:id/like", async (req, res) => {
    try {
      const success = await storage.likeForumPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post liked successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Timeline routes
  app.get("/api/pets/:id/timeline", async (req, res) => {
    try {
      const timeline = await storage.getPetTimeline(req.params.id);
      res.json(timeline);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/pets/:id/timeline", async (req, res) => {
    try {
      const validation = insertTimelineSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid timeline data", errors: validation.error.issues });
      }
      
      const timelineData = { ...validation.data, petId: req.params.id };
      const entry = await storage.createTimelineEntry(timelineData);
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Community trends (mock data)
  app.get("/api/community/trends", async (req, res) => {
    try {
      const trends = {
        popularFoods: [
          { name: "Royal Canin Adult", percentage: 73, amazonLink: "#" },
          { name: "Blue Buffalo Life", percentage: 61, amazonLink: "#" },
          { name: "Hill's Science Diet", percentage: 45, amazonLink: "#" }
        ],
        activities: [
          { name: "Daily walks", percentage: 94 },
          { name: "Fetch games", percentage: 78 },
          { name: "Swimming", percentage: 52 },
          { name: "Agility training", percentage: 31 }
        ],
        recommendedProducts: [
          { name: "Interactive Puzzle Toy", price: "$24.99", amazonLink: "#" },
          { name: "Orthopedic Dog Bed", price: "$89.99", amazonLink: "#" }
        ]
      };
      res.json(trends);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Health suggestions (mock data)
  app.get("/api/health/suggestions", async (req, res) => {
    try {
      const suggestions = {
        checkups: [
          { title: "Annual wellness exam", status: "completed" },
          { title: "Hip dysplasia screening", status: "due" },
          { title: "Eye exam", status: "recommended" }
        ],
        preventiveCare: [
          "Monthly heartworm prevention",
          "Flea and tick control",
          "Regular exercise routine",
          "Dental care and teeth cleaning"
        ],
        nutrition: [
          "High-quality adult dog food",
          "Portion control based on activity level",
          "Fresh water always available",
          "Avoid toxic foods (chocolate, grapes, etc.)"
        ]
      };
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Nearby vets (mock Google Places API)
  app.get("/api/vets/nearby", async (req, res) => {
    try {
      const vets = [
        {
          id: "vet-1",
          name: "City Pet Hospital",
          address: "123 Main Street",
          distance: "0.8 miles",
          rating: 4.8,
          reviews: 124,
          phone: "(555) 123-4567",
          hours: "Emergency & routine care • Open 24/7"
        },
        {
          id: "vet-2",
          name: "Paws & Claws Veterinary",
          address: "456 Oak Avenue",
          distance: "1.2 miles",
          rating: 4.6,
          reviews: 89,
          phone: "(555) 234-5678",
          hours: "Routine care & vaccinations • Mon-Sat 8AM-6PM"
        },
        {
          id: "vet-3",
          name: "Animal Medical Center",
          address: "789 Elm Street",
          distance: "1.5 miles",
          rating: 4.9,
          reviews: 156,
          phone: "(555) 345-6789",
          hours: "Specialist care & surgery • By appointment"
        }
      ];
      res.json(vets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Famous equivalents (mock Wikipedia API)
  app.get("/api/famous-equivalents/:age", async (req, res) => {
    try {
      const age = parseInt(req.params.age);
      const equivalents = {
        dogs: [
          { name: "Lassie", description: "Famous Collie from TV and movies" },
          { name: "Rin Tin Tin", description: "German Shepherd movie star" }
        ],
        people: [
          { name: "Taylor Swift", description: `Singer-songwriter at age ${age}` },
          { name: "Michael Jordan", description: `Basketball legend at age ${age}` }
        ]
      };
      res.json(equivalents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mock Stripe payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      // Mock Stripe response
      const paymentIntent = {
        id: "pi_mock_" + Date.now(),
        client_secret: "pi_mock_" + Date.now() + "_secret",
        amount: amount * 100, // Convert to cents
        currency: "usd",
        status: "requires_payment_method"
      };
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mock subscription
  app.post("/api/create-subscription", async (req, res) => {
    try {
      // Mock subscription response
      const subscription = {
        id: "sub_mock_" + Date.now(),
        client_secret: "sub_mock_" + Date.now() + "_secret",
        status: "requires_payment_method"
      };
      res.json({ clientSecret: subscription.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
