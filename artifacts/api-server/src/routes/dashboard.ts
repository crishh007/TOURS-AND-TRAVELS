import { Router } from "express";
import { db, tripsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/dashboard/summary", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const trips = await db.select().from(tripsTable).where(eq(tripsTable.userId, req.userId!));
    const now = new Date().toISOString().split("T")[0];
    const upcomingTrips = trips.filter(t => t.startDate >= now).length;
    const totalSpent = trips.reduce((acc, t) => acc + t.spentAmount, 0);
    const recentTrips = [...trips]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(t => ({
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
      }));

    const totalDaysTraveled = trips.reduce((acc, t) => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      const diff = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      return acc + diff;
    }, 0);

    const destCounts: Record<string, number> = {};
    trips.forEach(t => {
      destCounts[t.destinationName] = (destCounts[t.destinationName] || 0) + 1;
    });
    const favoriteDestination = Object.entries(destCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    res.json({
      totalTrips: trips.length,
      upcomingTrips,
      totalSpent,
      savedDestinations: trips.length,
      recentTrips,
      favoriteDestination,
      totalDaysTraveled,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/recent-activity", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const trips = await db.select().from(tripsTable)
      .where(eq(tripsTable.userId, req.userId!));

    const activities = trips.slice(0, 5).map((t, i) => ({
      id: t.id,
      type: i % 2 === 0 ? "trip_saved" : "itinerary_generated",
      title: i % 2 === 0 ? `Trip to ${t.destinationName} saved` : `AI itinerary for ${t.destinationName} generated`,
      description: `${t.startDate} → ${t.endDate} · Budget ₹${t.totalBudget.toLocaleString("en-IN")}`,
      timestamp: t.createdAt.toISOString(),
      imageUrl: t.destinationImage,
    }));

    res.json(activities);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
