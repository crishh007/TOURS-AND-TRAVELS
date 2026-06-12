import { count } from "drizzle-orm";
import { db, destinationsTable } from "./index";
import { DESTINATION_SEED_DATA } from "./seed-data";

export async function seedIfEmpty(): Promise<void> {
  const [result] = await db.select({ value: count() }).from(destinationsTable);
  const existing = Number(result?.value ?? 0);

  if (existing > 0) {
    return;
  }

  await db.insert(destinationsTable).values(DESTINATION_SEED_DATA);
}
