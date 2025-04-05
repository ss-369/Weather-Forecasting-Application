import { recentSearches, type RecentSearch, type InsertRecentSearch } from "@shared/schema";
import { format } from "date-fns";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

export interface IStorage {
  getRecentSearches(limit?: number): Promise<RecentSearch[]>;
  addRecentSearch(search: InsertRecentSearch): Promise<RecentSearch>;
  clearRecentSearches(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getRecentSearches(limit: number = 5): Promise<RecentSearch[]> {
    // Get searches sorted by timestamp (newest first)
    return await db
      .select()
      .from(recentSearches)
      .orderBy(desc(recentSearches.timestamp))
      .limit(limit);
  }

  async addRecentSearch(insertSearch: InsertRecentSearch): Promise<RecentSearch> {
    // First check if this city is already in recent searches
    const existingSearch = await db
      .select()
      .from(recentSearches)
      .where(eq(sql`LOWER(${recentSearches.city})`, insertSearch.city.toLowerCase()))
      .limit(1);
    
    // If it exists, remove it (we'll add the updated one)
    if (existingSearch.length > 0) {
      await db
        .delete(recentSearches)
        .where(eq(recentSearches.id, existingSearch[0].id));
    }
    
    // Add the new search
    const [newSearch] = await db
      .insert(recentSearches)
      .values(insertSearch)
      .returning();
    
    // Keep only the most recent 5 searches
    const allSearches = await db
      .select()
      .from(recentSearches)
      .orderBy(desc(recentSearches.timestamp));
    
    if (allSearches.length > 5) {
      // Get IDs of searches to keep (the 5 most recent)
      const idsToKeep = allSearches
        .slice(0, 5)
        .map(search => search.id);
      
      // Delete all searches except the ones we want to keep
      await db
        .delete(recentSearches)
        .where(sql`id NOT IN (${idsToKeep.join(', ')})`);
    }
    
    return newSearch;
  }

  async clearRecentSearches(): Promise<void> {
    await db.delete(recentSearches);
  }
}

export const storage = new DatabaseStorage();
