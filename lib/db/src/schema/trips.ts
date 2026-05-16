import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { destinationsTable } from "./destinations";

export const tripsTable = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  destinationId: integer("destination_id").notNull().references(() => destinationsTable.id),
  destinationName: text("destination_name").notNull(),
  destinationImage: text("destination_image"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalBudget: real("total_budget").notNull().default(0),
  spentAmount: real("spent_amount").notNull().default(0),
  status: text("status").notNull().default("upcoming"),
  itinerary: text("itinerary"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTripSchema = createInsertSchema(tripsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof tripsTable.$inferSelect;
