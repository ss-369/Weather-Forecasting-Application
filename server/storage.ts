import { recentSearches, type RecentSearch, type InsertRecentSearch } from "@shared/schema";
import { format } from "date-fns";

export interface IStorage {
  getRecentSearches(limit?: number): Promise<RecentSearch[]>;
  addRecentSearch(search: InsertRecentSearch): Promise<RecentSearch>;
  clearRecentSearches(): Promise<void>;
}

export class MemStorage implements IStorage {
  private searches: Map<number, RecentSearch>;
  currentId: number;

  constructor() {
    this.searches = new Map();
    this.currentId = 1;
  }

  async getRecentSearches(limit: number = 5): Promise<RecentSearch[]> {
    const searchArray = Array.from(this.searches.values());
    
    // Sort by timestamp (newest first)
    const sortedSearches = searchArray.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    // Limit the number of results
    return sortedSearches.slice(0, limit);
  }

  async addRecentSearch(insertSearch: InsertRecentSearch): Promise<RecentSearch> {
    const id = this.currentId++;
    const timestamp = new Date();
    
    const search: RecentSearch = { 
      id, 
      ...insertSearch, 
      timestamp 
    };
    
    // Check if this city is already in recent searches
    const existingSearches = Array.from(this.searches.values());
    const existingSearchIndex = existingSearches.findIndex(
      s => s.city.toLowerCase() === insertSearch.city.toLowerCase()
    );
    
    // If it exists, remove it (we'll add the updated one)
    if (existingSearchIndex !== -1) {
      const existingSearch = existingSearches[existingSearchIndex];
      this.searches.delete(existingSearch.id);
    }
    
    this.searches.set(id, search);
    
    // Maintain at most 5 recent searches
    if (this.searches.size > 5) {
      // Find oldest search
      const oldestSearch = existingSearches
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];
      
      if (oldestSearch) {
        this.searches.delete(oldestSearch.id);
      }
    }
    
    return search;
  }

  async clearRecentSearches(): Promise<void> {
    this.searches.clear();
  }
}

export const storage = new MemStorage();
