import { pgTable, text, serial, timestamp, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const destinationsTable = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  rating: real("rating").notNull().default(4.0),
  bestTime: text("best_time").notNull(),
  tags: text("tags").array().notNull().default([]),
  isTrending: boolean("is_trending").notNull().default(false),
  isHiddenGem: boolean("is_hidden_gem").notNull().default(false),
  avgBudgetPerDay: integer("avg_budget_per_day").notNull().default(2000),
  mood: text("mood"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable).omit({ id: true, createdAt: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;
