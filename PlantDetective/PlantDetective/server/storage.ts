import { eq } from 'drizzle-orm';
import { db } from './db';
import { plants, identifications, type Plant, type InsertPlant, type Identification, type InsertIdentification } from '../shared/schema';

// Interface for our storage implementation
export interface IStorage {
  // Plant methods
  getPlant(id: number): Promise<Plant | undefined>;
  getPlantByName(commonName: string): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  
  // Identification methods
  createIdentification(identification: InsertIdentification): Promise<Identification>;
  getRecentIdentifications(limit?: number): Promise<Identification[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Plant methods
  async getPlant(id: number): Promise<Plant | undefined> {
    const [plant] = await db.select().from(plants).where(eq(plants.id, id));
    return plant || undefined;
  }

  async getPlantByName(commonName: string): Promise<Plant | undefined> {
    const [plant] = await db.select().from(plants).where(eq(plants.commonName, commonName));
    return plant || undefined;
  }

  async createPlant(plant: InsertPlant): Promise<Plant> {
    const [newPlant] = await db.insert(plants).values(plant).returning();
    return newPlant;
  }
  
  // Identification methods
  async createIdentification(identification: InsertIdentification): Promise<Identification> {
    const [newIdentification] = await db.insert(identifications).values(identification).returning();
    return newIdentification;
  }
  
  async getRecentIdentifications(limit: number = 10): Promise<Identification[]> {
    return await db
      .select()
      .from(identifications)
      .orderBy(identifications.createdAt)
      .limit(limit);
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();
