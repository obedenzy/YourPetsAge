import { type User, type InsertUser, type Pet, type InsertPet, type Meetup, type InsertMeetup, type ForumPost, type InsertForumPost, type Achievement, type InsertAchievement, type PetTimeline, type InsertPetTimeline } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(id: string, tokens: number): Promise<User>;
  updateUserPremium(id: string, isPremium: boolean): Promise<User>;

  // Pet operations
  getPet(id: string): Promise<Pet | undefined>;
  getPetsByUserId(userId: string): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: string, updates: Partial<Pet>): Promise<Pet>;
  deletePet(id: string): Promise<boolean>;

  // Meetup operations
  getMeetup(id: string): Promise<Meetup | undefined>;
  getMeetups(): Promise<Meetup[]>;
  getMeetupsByLocation(location: string): Promise<Meetup[]>;
  createMeetup(meetup: InsertMeetup): Promise<Meetup>;
  joinMeetup(meetupId: string, userId: string): Promise<boolean>;

  // Forum operations
  getForumPosts(category?: string): Promise<ForumPost[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  likeForumPost(id: string): Promise<boolean>;

  // Achievement operations
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Timeline operations
  getPetTimeline(petId: string): Promise<PetTimeline[]>;
  createTimelineEntry(entry: InsertPetTimeline): Promise<PetTimeline>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private pets: Map<string, Pet> = new Map();
  private meetups: Map<string, Meetup> = new Map();
  private forumPosts: Map<string, ForumPost> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private timeline: Map<string, PetTimeline> = new Map();

  constructor() {
    // Initialize with mock user
    const mockUser: User = {
      id: "user-1",
      username: "Alex",
      email: "alex@example.com",
      tokens: 12,
      isPremium: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(mockUser.id, mockUser);

    // Initialize with mock pets
    const mockPet1: Pet = {
      id: "pet-1",
      userId: "user-1",
      name: "Buddy",
      kind: "dog",
      breed: "Golden Retriever",
      birthDate: "2020-03-15",
      sizeCategory: "large",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      createdAt: new Date(),
    };

    const mockPet2: Pet = {
      id: "pet-2",
      userId: "user-1",
      name: "Luna",
      kind: "dog",
      breed: "Beagle",
      birthDate: "2022-08-10",
      sizeCategory: "medium",
      imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      createdAt: new Date(),
    };

    this.pets.set(mockPet1.id, mockPet1);
    this.pets.set(mockPet2.id, mockPet2);

    // Initialize mock meetups
    const mockMeetup1: Meetup = {
      id: "meetup-1",
      organizerId: "user-1",
      title: "Golden Retriever Playdate",
      description: "Join us for a peaceful evening walk along the riverside. Perfect for socializing active young adult dogs!",
      date: new Date("2024-12-15T18:00:00"),
      location: "Riverside Park",
      ageGroup: "Young Adults",
      breedSize: "Large breeds",
      maxAttendees: 10,
      attendees: ["user-1"],
      createdAt: new Date(),
    };

    this.meetups.set(mockMeetup1.id, mockMeetup1);

    // Initialize mock forum posts
    const mockPost1: ForumPost = {
      id: "post-1",
      authorId: "user-1",
      category: "Young Adults (1-3 years)",
      title: "Help with leash training my Golden Retriever!",
      content: "My 2-year-old Golden Retriever keeps pulling on walks. I've tried different techniques but nothing seems to work consistently. Has anyone had success with specific training methods?",
      likes: 12,
      replies: 8,
      createdAt: new Date(),
    };

    this.forumPosts.set(mockPost1.id, mockPost1);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      tokens: insertUser.tokens ?? 0,
      isPremium: insertUser.isPremium ?? false,
      stripeCustomerId: insertUser.stripeCustomerId ?? null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserTokens(id: string, tokens: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, tokens };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPremium(id: string, isPremium: boolean): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, isPremium };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Pet operations
  async getPet(id: string): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async getPetsByUserId(userId: string): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(pet => pet.userId === userId);
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = randomUUID();
    const pet: Pet = {
      ...insertPet,
      id,
      imageUrl: insertPet.imageUrl ?? null,
      createdAt: new Date(),
    };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: string, updates: Partial<Pet>): Promise<Pet> {
    const pet = this.pets.get(id);
    if (!pet) throw new Error("Pet not found");
    
    const updatedPet = { ...pet, ...updates };
    this.pets.set(id, updatedPet);
    return updatedPet;
  }

  async deletePet(id: string): Promise<boolean> {
    return this.pets.delete(id);
  }

  // Meetup operations
  async getMeetup(id: string): Promise<Meetup | undefined> {
    return this.meetups.get(id);
  }

  async getMeetups(): Promise<Meetup[]> {
    return Array.from(this.meetups.values());
  }

  async getMeetupsByLocation(location: string): Promise<Meetup[]> {
    return Array.from(this.meetups.values()).filter(meetup => 
      meetup.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async createMeetup(insertMeetup: InsertMeetup): Promise<Meetup> {
    const id = randomUUID();
    const meetup: Meetup = {
      ...insertMeetup,
      id,
      description: insertMeetup.description ?? null,
      breedSize: insertMeetup.breedSize ?? null,
      maxAttendees: insertMeetup.maxAttendees ?? null,
      attendees: insertMeetup.attendees ?? [],
      createdAt: new Date(),
    };
    this.meetups.set(id, meetup);
    return meetup;
  }

  async joinMeetup(meetupId: string, userId: string): Promise<boolean> {
    const meetup = this.meetups.get(meetupId);
    if (!meetup) return false;
    
    const attendees = Array.isArray(meetup.attendees) ? meetup.attendees : [];
    if (!attendees.includes(userId)) {
      const updatedMeetup = {
        ...meetup,
        attendees: [...attendees, userId]
      };
      this.meetups.set(meetupId, updatedMeetup);
    }
    return true;
  }

  // Forum operations
  async getForumPosts(category?: string): Promise<ForumPost[]> {
    const posts = Array.from(this.forumPosts.values());
    if (category) {
      return posts.filter(post => post.category === category);
    }
    return posts;
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = randomUUID();
    const post: ForumPost = {
      ...insertPost,
      id,
      likes: insertPost.likes ?? 0,
      replies: insertPost.replies ?? 0,
      createdAt: new Date(),
    };
    this.forumPosts.set(id, post);
    return post;
  }

  async likeForumPost(id: string): Promise<boolean> {
    const post = this.forumPosts.get(id);
    if (!post) return false;
    
    const updatedPost = { ...post, likes: post.likes + 1 };
    this.forumPosts.set(id, updatedPost);
    return true;
  }

  // Achievement operations
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      unlockedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Timeline operations
  async getPetTimeline(petId: string): Promise<PetTimeline[]> {
    return Array.from(this.timeline.values()).filter(entry => entry.petId === petId);
  }

  async createTimelineEntry(insertEntry: InsertPetTimeline): Promise<PetTimeline> {
    const id = randomUUID();
    const entry: PetTimeline = {
      ...insertEntry,
      id,
      description: insertEntry.description ?? null,
      imageUrl: insertEntry.imageUrl ?? null,
      createdAt: new Date(),
    };
    this.timeline.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
