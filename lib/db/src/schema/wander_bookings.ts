import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const wanderBookingsTable = pgTable("wander_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(), // 'hotel' or 'restaurant'
  itemName: text("item_name").notNull(),
  details: text("details").notNull(), // JSON string for check-in, check-out, time, room type, etc.
  guests: integer("guests").notNull(),
  totalCost: real("total_cost").notNull().default(0),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
