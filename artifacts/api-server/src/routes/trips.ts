import { Router } from "express";
import { db, tripsTable, expensesTable } from "@workspace/db";
import { eq, and, sum } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";
import { CreateTripBody, GetTripParams, DeleteTripParams, CreateExpenseBody, DeleteExpenseParams, ListExpensesParams } from "@workspace/api-zod";

const router = Router();

// List user trips
router.get("/trips", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const trips = await db.select().from(tripsTable).where(eq(tripsTable.userId, req.userId!));
    res.json(trips.map(formatTrip));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create trip
router.post("/trips", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = CreateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const [trip] = await db.insert(tripsTable).values({
      ...parsed.data,
      userId: req.userId!,
    }).returning();
    res.status(201).json(formatTrip(trip));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get trip by ID
router.get("/trips/:id", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = GetTripParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [trip] = await db.select().from(tripsTable)
      .where(and(eq(tripsTable.id, parsed.data.id), eq(tripsTable.userId, req.userId!)))
      .limit(1);
    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }
    res.json(formatTrip(trip));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete trip
router.delete("/trips/:id", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = DeleteTripParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    await db.delete(tripsTable)
      .where(and(eq(tripsTable.id, parsed.data.id), eq(tripsTable.userId, req.userId!)));
    res.json({ message: "Trip deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List expenses for a trip
router.get("/trips/:tripId/expenses", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = ListExpensesParams.safeParse({ tripId: Number(req.params.tripId) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid tripId" });
    return;
  }
  try {
    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.tripId, parsed.data.tripId));
    res.json(expenses.map(formatExpense));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add expense to a trip
router.post("/trips/:tripId/expenses", authMiddleware, async (req: AuthRequest, res) => {
  const tripId = Number(req.params.tripId);
  const parsed = CreateExpenseBody.safeParse(req.body);
  if (!parsed.success || isNaN(tripId)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const [expense] = await db.insert(expensesTable).values({
      ...parsed.data,
      tripId,
    }).returning();

    // Update trip spentAmount
    const result = await db.select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.tripId, tripId));
    const total = Number(result[0]?.total ?? 0);
    await db.update(tripsTable).set({ spentAmount: total }).where(eq(tripsTable.id, tripId));

    res.status(201).json(formatExpense(expense));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete expense
router.delete("/trips/:tripId/expenses/:expenseId", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = DeleteExpenseParams.safeParse({
    tripId: Number(req.params.tripId),
    expenseId: Number(req.params.expenseId),
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }
  try {
    await db.delete(expensesTable).where(
      and(eq(expensesTable.id, parsed.data.expenseId), eq(expensesTable.tripId, parsed.data.tripId))
    );

    // Recalculate trip spent
    const result = await db.select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.tripId, parsed.data.tripId));
    const total = Number(result[0]?.total ?? 0);
    await db.update(tripsTable).set({ spentAmount: total }).where(eq(tripsTable.id, parsed.data.tripId));

    res.json({ message: "Expense deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatTrip(t: typeof tripsTable.$inferSelect) {
  return {
    id: t.id,
    userId: t.userId,
    destinationId: t.destinationId,
    destinationName: t.destinationName,
    destinationImage: t.destinationImage,
    startDate: t.startDate,
    endDate: t.endDate,
    totalBudget: t.totalBudget,
    spentAmount: t.spentAmount,
    status: t.status,
    itinerary: t.itinerary,
    notes: t.notes,
    createdAt: t.createdAt.toISOString(),
  };
}

function formatExpense(e: typeof expensesTable.$inferSelect) {
  return {
    id: e.id,
    tripId: e.tripId,
    category: e.category,
    amount: e.amount,
    description: e.description,
    date: e.date,
  };
}

export default router;
