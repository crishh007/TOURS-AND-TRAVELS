import { Router } from "express";
import { db, destinationsTable } from "@workspace/db";
import { eq, ilike, and, or } from "drizzle-orm";
import { ListDestinationsQueryParams, GetDestinationParams } from "@workspace/api-zod";

const router = Router();

router.get("/destinations", async (req, res) => {
  const parsed = ListDestinationsQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};

  try {
    let query = db.select().from(destinationsTable);
    const conditions = [];
    if (params.search) {
      conditions.push(
        or(
          ilike(destinationsTable.name, `%${params.search}%`),
          ilike(destinationsTable.state, `%${params.search}%`),
        )
      );
    }
    if (params.category) {
      conditions.push(eq(destinationsTable.category, params.category));
    }
    if (params.mood) {
      conditions.push(eq(destinationsTable.mood, params.mood));
    }
    const rows = conditions.length > 0
      ? await db.select().from(destinationsTable).where(and(...conditions))
      : await db.select().from(destinationsTable);

    res.json(rows.map(formatDest));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/destinations/trending", async (req, res) => {
  try {
    const rows = await db.select().from(destinationsTable).where(eq(destinationsTable.isTrending, true));
    res.json(rows.map(formatDest));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/destinations/hidden-gems", async (req, res) => {
  try {
    const rows = await db.select().from(destinationsTable).where(eq(destinationsTable.isHiddenGem, true));
    res.json(rows.map(formatDest));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/destinations/:id", async (req, res) => {
  const parsed = GetDestinationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [row] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, parsed.data.id)).limit(1);
    if (!row) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }
    res.json(formatDest(row));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatDest(d: typeof destinationsTable.$inferSelect) {
  return {
    id: d.id,
    name: d.name,
    state: d.state,
    description: d.description,
    imageUrl: d.imageUrl,
    category: d.category,
    rating: d.rating,
    bestTime: d.bestTime,
    tags: d.tags,
    isTrending: d.isTrending,
    isHiddenGem: d.isHiddenGem,
    avgBudgetPerDay: d.avgBudgetPerDay,
    mood: d.mood,
  };
}

export default router;
