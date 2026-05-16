import { Router } from "express";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";
import { db, destinationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GenerateItineraryBody, GetMoodRecommendationsBody, SendChatMessageBody, GeneratePackingListBody } from "@workspace/api-zod";

const router = Router();

const MOOD_DESTINATIONS: Record<string, string[]> = {
  stressed: ["relaxed", "peaceful"],
  relaxed: ["relaxed", "romantic"],
  romantic: ["romantic"],
  energetic: ["adventurous", "energetic"],
  adventurous: ["adventurous"],
  lonely: ["peaceful", "relaxed"],
  party: ["energetic", "adventurous"],
  family: ["family"],
};

const MOOD_ACTIVITIES: Record<string, string[]> = {
  stressed: ["Sunrise yoga on beach", "Silent forest walks", "Meditation retreats", "Hot spring soaking", "Ayurvedic spa therapy"],
  relaxed: ["Backwater houseboat stay", "Sunrise boat ride on Ganges", "Tea garden walks", "Waterfall picnics", "Village homestay"],
  romantic: ["Candlelight dinner with sunset views", "Camel ride at Thar Desert", "Heritage palace stay", "Shikara ride on Dal Lake", "Private beach sunset"],
  energetic: ["White water rafting in Rishikesh", "Paragliding in Bir Billing", "Trekking to Triund", "Bungee jumping", "Night cycling in Goa"],
  adventurous: ["Himalayan base camp trek", "Dune bashing in Jaisalmer", "Rock climbing in Hampi", "Scuba diving in Andamans", "Snow leopard safari in Ladakh"],
  lonely: ["Sunrise watch at Kanyakumari", "Solo trek in Spiti Valley", "Buddhist monastery retreat", "Writing at cafe in Mcleod Ganj", "Volunteer travel in Rajasthan"],
  party: ["Beach parties in Goa", "Night bazaars in Jaipur", "Rooftop bars in Mumbai", "Electronic music festivals", "Cafes in Bengaluru"],
  family: ["Ranthambore safari", "Kerala houseboat with family", "Theme parks in Chennai", "Manali snow activities", "Golden Temple langar experience"],
};

const MOOD_STYLES: Record<string, string> = {
  stressed: "Slow travel — minimal itinerary, maximum peace",
  relaxed: "Leisurely exploration at your own pace",
  romantic: "Intimate, curated experiences for two",
  energetic: "Action-packed days with adventure at every turn",
  adventurous: "Off-the-beaten-path, raw and authentic India",
  lonely: "Solo travel that feels like a journey within",
  party: "Live the vibrant, electric nightlife of India",
  family: "Safe, fun and memorable for every age group",
};

router.post("/ai/itinerary", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = GenerateItineraryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { destination, days, mood, budget, interests = [] } = parsed.data;

  const itinerary = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const activities = generateDayActivities(destination, mood, interests, day);
    return {
      day,
      title: `Day ${day}: ${getDayTitle(destination, day, days)}`,
      activities,
      meals: generateMeals(destination, day),
      accommodation: getAccommodation(destination, budget, mood),
      tips: getDayTip(destination, day),
    };
  });

  res.json({
    destination,
    days,
    itinerary,
    tips: [
      `Best time to visit ${destination} depends on the season — plan accordingly.`,
      "Always carry a reusable water bottle and local currency.",
      "Respect local customs and dress codes at religious sites.",
      `Your estimated daily budget: ₹${Math.round(budget / days).toLocaleString("en-IN")}`,
      "Book accommodations in advance during peak season.",
    ],
    estimatedCost: budget,
  });
});

router.post("/ai/mood-recommendations", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = GetMoodRecommendationsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { mood } = parsed.data;

  const destinations = await db.select().from(destinationsTable);
  const moodDests = destinations.filter(d =>
    d.mood && (MOOD_DESTINATIONS[mood] || []).includes(d.mood)
  ).slice(0, 4);

  // If fewer than 4, fill with any destinations
  const fill = destinations.filter(d => !moodDests.find(m => m.id === d.id)).slice(0, 4 - moodDests.length);
  const finalDests = [...moodDests, ...fill].slice(0, 4);

  res.json({
    mood,
    destinations: finalDests.map(d => ({
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
    })),
    activities: MOOD_ACTIVITIES[mood] || MOOD_ACTIVITIES.relaxed,
    travelStyle: MOOD_STYLES[mood] || "Explore India at your own pace",
    packingTips: getPackingTips(mood),
    bestSeason: "October to March",
  });
});

router.post("/ai/chat", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { message } = parsed.data;
  const lower = message.toLowerCase();

  let response = "";
  let suggestions: string[] = [];

  if (lower.includes("goa")) {
    response = "Goa is India's beach paradise! Best visited from November to February. You can enjoy beach shacks, water sports, Portuguese architecture in Old Goa, and vibrant nightlife. I recommend staying in North Goa for parties and South Goa for tranquility.";
    suggestions = ["Best beaches in Goa", "Goa nightlife guide", "Goa budget travel tips", "Best time to visit Goa"];
  } else if (lower.includes("rajasthan") || lower.includes("jaipur") || lower.includes("udaipur")) {
    response = "Rajasthan is India's royal heartland! Jaipur's Pink City has the Amber Fort and Hawa Mahal. Udaipur is the City of Lakes with stunning palace views. Jaisalmer has golden dunes and desert camps. Best time: October to March.";
    suggestions = ["Rajasthan royal palaces", "Desert camp in Jaisalmer", "Udaipur lake palace", "Jaipur travel itinerary"];
  } else if (lower.includes("kerala")) {
    response = "Kerala, God's Own Country, offers backwater houseboats in Alleppey, Munnar's tea gardens, wildlife in Wayanad, and beaches in Kovalam. The food is incredible — try a proper Kerala Sadhya! Best time: September to March.";
    suggestions = ["Kerala houseboat booking", "Munnar tea gardens", "Kerala backwaters guide", "Best Kerala food"];
  } else if (lower.includes("ladakh") || lower.includes("himachal") || lower.includes("manali")) {
    response = "The Himalayas are calling! Ladakh offers surreal landscapes, Buddhist monasteries, and Pangong Lake. Manali has adventure sports, old Manali cafes, and Rohtang Pass. Best time: May to September for most areas.";
    suggestions = ["Ladakh road trip guide", "Manali adventure activities", "Spiti Valley trek", "Himalayan passes to cross"];
  } else if (lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable")) {
    response = "India is amazingly budget-friendly! You can travel comfortably for ₹1,500–2,500/day including accommodation and food. Use state buses and trains for transport. Eat at local dhabas and thali restaurants. Stay in hostels or guesthouses. Apps like IRCTC for trains and MakeMyTrip for deals help a lot!";
    suggestions = ["Budget travel India tips", "Cheapest destinations in India", "India hostel guide", "Train travel in India"];
  } else if (lower.includes("food") || lower.includes("eat") || lower.includes("cuisine")) {
    response = "Indian cuisine is a universe! Try butter chicken in Delhi, fish curry in Goa, biryani in Hyderabad, dosas in Chennai, thali in Rajasthan, and momos in Darjeeling. Street food is phenomenal — pani puri, chaat, vada pav. Always try the local speciality wherever you go!";
    suggestions = ["Best street food in India", "Indian regional cuisines", "Food tours in India", "Vegetarian India travel"];
  } else if (lower.includes("safe") || lower.includes("safety")) {
    response = "India is generally safe for travelers. Keep copies of your documents, use reputable transport apps like Ola and Uber in cities, stay aware in crowded areas, and trust your instincts. For solo women travelers, dress modestly in conservative areas and travel during daytime on longer journeys.";
    suggestions = ["India travel safety tips", "Solo female travel India", "Emergency contacts India", "Travel insurance for India"];
  } else if (lower.includes("visa")) {
    response = "India offers e-Visa for 170+ countries — apply online at indianvisaonline.gov.in. It's usually approved within 3-4 business days. The tourist e-Visa allows stays up to 180 days. Keep a printed copy with you always!";
    suggestions = ["India e-Visa application", "India visa requirements", "Visa on arrival India", "India entry requirements"];
  } else {
    response = `Great question about "${message}"! As your WanderIndia AI guide, I'm here to help you discover the magic of India. Whether you're looking for beach escapes, mountain adventures, cultural heritage, or spiritual journeys — India has it all. What specific aspect of India travel would you like to explore?`;
    suggestions = ["Top destinations in India", "Best time to visit India", "India travel on a budget", "Cultural experiences in India"];
  }

  res.json({ message: response, suggestions });
});

router.post("/ai/packing-list", authMiddleware, async (req: AuthRequest, res) => {
  const parsed = GeneratePackingListBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { destination, season, activities } = parsed.data;

  const isBeach = destination.toLowerCase().includes("goa") || activities.includes("beach") || activities.includes("swimming");
  const isMountain = activities.includes("trekking") || activities.includes("hiking") || destination.toLowerCase().includes("himalaya") || destination.toLowerCase().includes("ladakh");
  const isCold = season === "winter" || isMountain;

  res.json({
    categories: [
      {
        name: "Clothing",
        items: isCold
          ? ["Thermal innerwear (2 sets)", "Fleece jacket", "Waterproof down jacket", "Warm trekking pants", "Wool socks (3 pairs)", "Beanie hat", "Gloves", "Light t-shirts (3)"]
          : isBeach
          ? ["Lightweight cotton t-shirts (4)", "Shorts / linen pants", "Swimwear (2 sets)", "Sarong / beach wrap", "Light sundress", "Flip-flops", "Sneakers"]
          : ["Breathable t-shirts (4)", "Comfortable pants / salwars", "Kurta or modest wear for temples", "Light cardigan", "Comfortable walking shoes", "Sandals"],
      },
      {
        name: "Essentials",
        items: ["Valid ID / Passport", "Visa documents (printed)", "Travel insurance papers", "Emergency contact card", "Debit / credit cards", "Cash in INR", "Mobile phone + charger", "Power bank (10,000 mAh)"],
      },
      {
        name: "Health & Safety",
        items: ["Personal medications", "Oral rehydration salts", "Antihistamines", "Band-aids & antiseptic", "Hand sanitizer", "Sunscreen SPF 50+", "Insect repellent", "Water purification tablets"],
      },
      {
        name: "Tech & Gadgets",
        items: ["Camera + extra memory cards", "Universal travel adapter", "Noise-cancelling earphones", "Portable WiFi or SIM card", "Kindle or books", "Offline maps (Google Maps offline)", "Emergency torch"],
      },
      {
        name: "Toiletries",
        items: ["Microfiber towel", "Shampoo & conditioner (travel size)", "Soap / body wash", "Toothbrush & toothpaste", "Moisturizer for dry climates", "Wet wipes (very useful!)", "Feminine hygiene products if needed"],
      },
      {
        name: "India-Specific",
        items: ["Scarf / dupatta (temple etiquette)", "Laundry bag", "Small backpack for day trips", "Reusable water bottle", "Plastic bags (rain protection)", "Snacks for long journeys", "Small notebook for journaling"],
      },
    ],
  });
});

// Helper functions
function getDayTitle(destination: string, day: number, totalDays: number): string {
  if (day === 1) return `Arrival & First Impressions of ${destination}`;
  if (day === totalDays) return `Final Day & Farewell to ${destination}`;
  const titles = [
    `Exploring ${destination}'s Heritage`,
    `Cultural Immersion in ${destination}`,
    `Adventure Day in ${destination}`,
    `Local Life & Hidden Spots`,
    `Spiritual & Cultural Journey`,
    `Day Trip & Scenic Exploration`,
  ];
  return titles[(day - 2) % titles.length];
}

function generateDayActivities(destination: string, mood: string, interests: string[], day: number): string[] {
  const baseActivities = [
    `Morning walk through ${destination}'s old quarter`,
    `Visit the most iconic landmark of ${destination}`,
    `Local street food tour at the central market`,
    `Sunset viewpoint photography session`,
    `Evening cultural performance or sound & light show`,
  ];

  const moodActivities: Record<string, string[]> = {
    adventurous: [`Adventure sports activity near ${destination}`, "Offbeat trail exploration", "Local village interaction"],
    romantic: [`Romantic dinner with view`, `Couples spa experience`, `Sunrise boat ride`],
    relaxed: [`Leisurely breakfast at a heritage cafe`, `Afternoon nap in the garden`, `Evening lakeside stroll`],
    energetic: [`Early morning cycling tour`, `Water sports session`, `High-energy local festival`],
    family: [`Interactive museum visit`, `Wildlife sanctuary tour`, `Cooking class with local family`],
  };

  const extras = moodActivities[mood] || [];
  return [...baseActivities.slice(0, 3 - Math.min(day - 1, 1)), ...extras.slice(0, 2 + Math.min(day - 1, 1))];
}

function generateMeals(destination: string, day: number): string[] {
  const meals = [
    [`Morning chai with poha at local dhaba`, `Thali lunch at heritage restaurant`, `Dinner at rooftop restaurant with city view`],
    [`South Indian breakfast at local joint`, `Street food lunch — chaat, kachori`, `Traditional dinner with local family`],
    [`Fruit and fresh juice breakfast`, `Biryani lunch at famous local spot`, `Candle-light dinner at premium restaurant`],
    [`Masala dosa breakfast`, `Curry and rice lunch`, `BBQ or tandoor dinner by the beach/mountains`],
  ];
  return meals[(day - 1) % meals.length];
}

function getAccommodation(destination: string, budget: number, mood: string): string {
  const budgetPerNight = budget / 7;
  if (budgetPerNight > 5000 || mood === "romantic") return `Heritage palace hotel or boutique stay in ${destination}`;
  if (budgetPerNight > 2000) return `Comfortable 3-star hotel near ${destination}'s main attractions`;
  return `Clean guesthouse or hostel in the heart of ${destination}`;
}

function getDayTip(destination: string, day: number): string {
  const tips = [
    "Carry cash as many small shops don't accept cards.",
    "Dress modestly when visiting religious sites.",
    "Bargain respectfully at local markets — it's part of the culture!",
    "Try the local transport for an authentic experience.",
    "Always have water and snacks when exploring remote areas.",
  ];
  return tips[(day - 1) % tips.length];
}

function getPackingTips(mood: string): string[] {
  const tips: Record<string, string[]> = {
    stressed: ["Pack a journal for mindful reflections", "Bring calming essential oils", "Noise-cancelling headphones for peace"],
    romantic: ["Pack a nice outfit for candlelight dinner", "Bring a good camera for memories", "Portable speaker for ambiance"],
    adventurous: ["Bring a first-aid kit", "Pack moisture-wicking clothes", "Good quality trekking shoes are essential"],
    energetic: ["Sports gear and swimwear", "Energy bars and electrolyte drinks", "Action camera for adventure shots"],
    family: ["Child-friendly sunscreen", "Easy-access snack pouches", "Portable entertainment for kids"],
  };
  return tips[mood] || ["Pack light — India's shopping is world-class!", "Always carry tissues and hand sanitizer", "A good power bank is non-negotiable"];
}

export default router;
