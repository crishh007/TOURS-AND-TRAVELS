import { Router } from "express";
import { db, wanderBookingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";
import { z } from "zod/v4";

const router = Router();

const CreateBookingBody = z.object({
  itemType: z.enum(["hotel", "restaurant"]),
  itemName: z.string(),
  details: z.string(), // Stores stringified JSON details of the booking
  guests: z.number().int().positive(),
  totalCost: z.number().nonnegative(),
});

// GET /bookings - Get all bookings for the logged-in user
router.get("/bookings", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const bookings = await db
      .select()
      .from(wanderBookingsTable)
      .where(eq(wanderBookingsTable.userId, req.userId!))
      .orderBy(desc(wanderBookingsTable.createdAt));
    
    res.json(bookings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /bookings - Create a new booking
router.post("/bookings", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  try {
    const [booking] = await db
      .insert(wanderBookingsTable)
      .values({
        userId: req.userId!,
        itemType: parsed.data.itemType,
        itemName: parsed.data.itemName,
        details: parsed.data.details,
        guests: parsed.data.guests,
        totalCost: parsed.data.totalCost,
      })
      .returning();

    res.status(201).json(booking);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
