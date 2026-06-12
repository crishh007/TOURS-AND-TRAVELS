import pg from "pg";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  trips_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 4.0,
  best_time TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden_gem BOOLEAN NOT NULL DEFAULT FALSE,
  avg_budget_per_day INTEGER NOT NULL DEFAULT 2000,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination_id INTEGER NOT NULL REFERENCES destinations(id),
  destination_name TEXT NOT NULL,
  destination_image TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_budget REAL NOT NULL DEFAULT 0,
  spent_amount REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming',
  itinerary TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const DESTINATIONS = [
  ["Goa", "Goa", "India's beach paradise with golden sands, Portuguese heritage, vibrant nightlife, and world-class seafood shacks along the Arabian Sea.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80", "Beach", 4.7, "November to February", ["beaches", "nightlife", "seafood", "water sports"], true, false, 2500, "energetic"],
  ["Ladakh", "Ladakh", "The roof of the world — surreal landscapes, Buddhist monasteries, Pangong Lake, and high-altitude adventures in the Himalayas.", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", "Mountains", 4.9, "May to September", ["himalayas", "monasteries", "trekking", "pangong lake"], true, false, 4500, "adventurous"],
  ["Alleppey", "Kerala", "God's Own Country — serene backwater houseboats, lush coconut groves, Ayurvedic retreats, and the famous Kerala Sadhya feast.", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", "Nature", 4.6, "September to March", ["backwaters", "houseboats", "ayurveda", "coconut groves"], true, false, 2200, "relaxed"],
  ["Jaipur", "Rajasthan", "The Pink City — majestic Amber Fort, Hawa Mahal, bustling bazaars, and royal Rajasthani cuisine in India's heritage heartland.", "https://images.unsplash.com/photo-1477587458883-47145ed4e85c?auto=format&fit=crop&w=800&q=80", "Heritage", 4.5, "October to March", ["forts", "palaces", "bazaars", "rajasthani cuisine"], true, false, 2000, "romantic"],
  ["Udaipur", "Rajasthan", "The City of Lakes — stunning palace views, romantic boat rides on Lake Pichola, and heritage havelis in a fairy-tale setting.", "https://images.unsplash.com/photo-1585131380118-9a3d2f22639a?auto=format&fit=crop&w=800&q=80", "Heritage", 4.8, "October to March", ["lakes", "palaces", "romantic", "heritage hotels"], true, false, 2800, "romantic"],
  ["Manali", "Himachal Pradesh", "Himalayan adventure hub — Rohtang Pass, paragliding, old Manali cafes, and snow-capped peaks for thrill-seekers and nature lovers.", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", "Adventure", 4.4, "March to June, October to December", ["snow", "paragliding", "trekking", "cafes"], false, false, 2500, "adventurous"],
  ["Varanasi", "Uttar Pradesh", "The spiritual capital of India — ancient ghats on the Ganges, mesmerizing Ganga Aarti, silk weaving, and timeless temple rituals.", "https://images.unsplash.com/photo-1561361513-0999b1d0d0e0?auto=format&fit=crop&w=800&q=80", "Spiritual", 4.3, "October to March", ["ghats", "ganga aarti", "temples", "spiritual"], false, false, 1500, "peaceful"],
  ["Andaman Islands", "Andaman & Nicobar", "Tropical paradise — crystal-clear waters, scuba diving, Radhanagar Beach, and pristine coral reefs in the Bay of Bengal.", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", "Island", 4.7, "October to May", ["scuba diving", "beaches", "coral reefs", "island"], false, false, 4500, "relaxed"],
  ["Rishikesh", "Uttarakhand", "Yoga capital of the world — white water rafting on the Ganges, ashrams, adventure sports, and serene Himalayan foothills.", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", "Adventure", 4.5, "September to April", ["rafting", "yoga", "ashrams", "ganges"], false, false, 1800, "energetic"],
  ["Darjeeling", "West Bengal", "Queen of the Hills — misty tea gardens, toy train rides, Kanchenjunga sunrise views, and colonial-era charm.", "https://images.unsplash.com/photo-1587474260587-136574528ed5?auto=format&fit=crop&w=800&q=80", "Nature", 4.4, "March to May, October to December", ["tea gardens", "toy train", "mountains", "sunrise"], false, false, 2000, "peaceful"],
  ["Spiti Valley", "Himachal Pradesh", "A cold desert mountain valley — ancient monasteries, starry skies, remote villages, and raw Himalayan beauty at 12,000 feet.", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80", "Adventure", 4.8, "June to September", ["cold desert", "monasteries", "remote", "stargazing"], false, true, 3500, "adventurous"],
  ["Hampi", "Karnataka", "UNESCO World Heritage site — surreal boulder-strewn landscape with 14th-century Vijayanagara ruins and ancient temples.", "https://images.unsplash.com/photo-1593693397640-1857fd4e3404?auto=format&fit=crop&w=800&q=80", "Culture", 4.6, "October to February", ["ruins", "boulders", "unesco", "history"], false, true, 1500, "adventurous"],
  ["Majuli", "Assam", "World's largest river island — Neo-Vaishnavite monasteries, Mishing tribal culture, and the mighty Brahmaputra's embrace.", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", "Culture", 4.5, "October to March", ["river island", "tribal culture", "monasteries", "brahmaputra"], false, true, 1200, "peaceful"],
  ["Ziro Valley", "Arunachal Pradesh", "Lush pine-covered valley home to the Apatani tribe — rice paddies, bamboo forests, and the famous Ziro Music Festival.", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", "Nature", 4.7, "March to October", ["tribal", "music festival", "pine forests", "rice paddies"], false, true, 1800, "peaceful"],
  ["Rann of Kutch", "Gujarat", "The Great White Desert — surreal salt flats, Rann Utsav festival, Kutchi handicrafts, and moonlit desert camps.", "https://images.unsplash.com/photo-1580619309936-0993c344d658?auto=format&fit=crop&w=800&q=80", "Culture", 4.6, "November to February", ["desert", "rann utsav", "handicrafts", "salt flats"], false, true, 2000, "adventurous"],
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA_SQL);

    const countResult = await client.query("SELECT COUNT(*)::int AS count FROM destinations");
    const existing = countResult.rows[0]?.count ?? 0;

    if (existing === 0) {
      for (const row of DESTINATIONS) {
        await client.query(
          `INSERT INTO destinations (name, state, description, image_url, category, rating, best_time, tags, is_trending, is_hidden_gem, avg_budget_per_day, mood)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          row,
        );
      }
      console.log(`Seeded ${DESTINATIONS.length} destinations.`);
    } else {
      console.log(`Destinations already seeded (${existing} rows).`);
    }

    console.log("Database setup complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
