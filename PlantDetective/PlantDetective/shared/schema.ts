import { integer, pgTable, serial, text, timestamp, boolean, json } from 'drizzle-orm/pg-core';

// Plants table - to store identified plants
export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  commonName: text('common_name').notNull(),
  scientificName: text('scientific_name').notNull(),
  description: text('description').notNull(),
  careTips: json('care_tips').notNull().$type<string[]>(),
  funFacts: json('fun_facts').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Plant identification history table - to track user identifications
export const identifications = pgTable('identifications', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plants.id),
  imageUrl: text('image_url'), // We could store image path or URL if we save the images
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isSuccessful: boolean('is_successful').default(true).notNull(),
  errorMessage: text('error_message'),
});

// Export types for TypeScript
export type Plant = typeof plants.$inferSelect;
export type InsertPlant = typeof plants.$inferInsert;

export type Identification = typeof identifications.$inferSelect;
export type InsertIdentification = typeof identifications.$inferInsert;
