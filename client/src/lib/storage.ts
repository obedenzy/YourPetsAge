import { Pet, User } from "@shared/schema";

// localStorage keys
const PETS_KEY = "petAgeTranslator_pets";
const USER_KEY = "petAgeTranslator_user";
const TIMELINE_KEY = "petAgeTranslator_timeline";

export interface TimelineEntry {
  id: string;
  petId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
}

export class LocalStorageService {
  // Pet operations
  getPets(): Pet[] {
    try {
      const pets = localStorage.getItem(PETS_KEY);
      return pets ? JSON.parse(pets) : [];
    } catch {
      return [];
    }
  }

  savePet(pet: Pet): void {
    const pets = this.getPets();
    const existingIndex = pets.findIndex(p => p.id === pet.id);
    
    if (existingIndex >= 0) {
      pets[existingIndex] = pet;
    } else {
      pets.push(pet);
    }
    
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  }

  deletePet(petId: string): void {
    const pets = this.getPets().filter(p => p.id !== petId);
    localStorage.setItem(PETS_KEY, JSON.stringify(pets));
  }

  getPet(petId: string): Pet | undefined {
    return this.getPets().find(p => p.id === petId);
  }

  // User operations
  getUser(): Partial<User> {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : { tokens: 12, isPremium: false };
    } catch {
      return { tokens: 12, isPremium: false };
    }
  }

  saveUser(user: Partial<User>): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  updateTokens(tokens: number): void {
    const user = this.getUser();
    user.tokens = tokens;
    this.saveUser(user);
  }

  // Timeline operations
  getTimeline(petId: string): TimelineEntry[] {
    try {
      const timeline = localStorage.getItem(TIMELINE_KEY);
      const allEntries: TimelineEntry[] = timeline ? JSON.parse(timeline) : [];
      return allEntries.filter(entry => entry.petId === petId);
    } catch {
      return [];
    }
  }

  saveTimelineEntry(entry: TimelineEntry): void {
    try {
      const timeline = localStorage.getItem(TIMELINE_KEY);
      const allEntries: TimelineEntry[] = timeline ? JSON.parse(timeline) : [];
      allEntries.push(entry);
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(allEntries));
    } catch (error) {
      console.error("Failed to save timeline entry:", error);
    }
  }

  deleteTimelineEntry(entryId: string): void {
    try {
      const timeline = localStorage.getItem(TIMELINE_KEY);
      const allEntries: TimelineEntry[] = timeline ? JSON.parse(timeline) : [];
      const filteredEntries = allEntries.filter(entry => entry.id !== entryId);
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error("Failed to delete timeline entry:", error);
    }
  }
}

export const storage = new LocalStorageService();
