import type { InsertDestination } from "./schema/destinations";

export const DESTINATION_SEED_DATA: InsertDestination[] = [
  {
    name: "Goa",
    state: "Goa",
    description:
      "India's beach paradise with golden sands, Portuguese heritage, vibrant nightlife, and world-class seafood shacks along the Arabian Sea.",
    imageUrl:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    category: "Beach",
    rating: 4.7,
    bestTime: "November to February",
    tags: ["beaches", "nightlife", "seafood", "water sports"],
    isTrending: true,
    isHiddenGem: false,
    avgBudgetPerDay: 2500,
    mood: "energetic",
  },
  {
    name: "Ladakh",
    state: "Ladakh",
    description:
      "The roof of the world — surreal landscapes, Buddhist monasteries, Pangong Lake, and high-altitude adventures in the Himalayas.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    category: "Mountains",
    rating: 4.9,
    bestTime: "May to September",
    tags: ["himalayas", "monasteries", "trekking", "pangong lake"],
    isTrending: true,
    isHiddenGem: false,
    avgBudgetPerDay: 4500,
    mood: "adventurous",
  },
  {
    name: "Alleppey",
    state: "Kerala",
    description:
      "God's Own Country — serene backwater houseboats, lush coconut groves, Ayurvedic retreats, and the famous Kerala Sadhya feast.",
    imageUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    category: "Nature",
    rating: 4.6,
    bestTime: "September to March",
    tags: ["backwaters", "houseboats", "ayurveda", "coconut groves"],
    isTrending: true,
    isHiddenGem: false,
    avgBudgetPerDay: 2200,
    mood: "relaxed",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    description:
      "The Pink City — majestic Amber Fort, Hawa Mahal, bustling bazaars, and royal Rajasthani cuisine in India's heritage heartland.",
    imageUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed4e85c?auto=format&fit=crop&w=800&q=80",
    category: "Heritage",
    rating: 4.5,
    bestTime: "October to March",
    tags: ["forts", "palaces", "bazaars", "rajasthani cuisine"],
    isTrending: true,
    isHiddenGem: false,
    avgBudgetPerDay: 2000,
    mood: "romantic",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    description:
      "The City of Lakes — stunning palace views, romantic boat rides on Lake Pichola, and heritage havelis in a fairy-tale setting.",
    imageUrl:
      "https://images.unsplash.com/photo-1585131380118-9a3d2f22639a?auto=format&fit=crop&w=800&q=80",
    category: "Heritage",
    rating: 4.8,
    bestTime: "October to March",
    tags: ["lakes", "palaces", "romantic", "heritage hotels"],
    isTrending: true,
    isHiddenGem: false,
    avgBudgetPerDay: 2800,
    mood: "romantic",
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    description:
      "Himalayan adventure hub — Rohtang Pass, paragliding, old Manali cafes, and snow-capped peaks for thrill-seekers and nature lovers.",
    imageUrl:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    category: "Adventure",
    rating: 4.4,
    bestTime: "March to June, October to December",
    tags: ["snow", "paragliding", "trekking", "cafes"],
    isTrending: false,
    isHiddenGem: false,
    avgBudgetPerDay: 2500,
    mood: "adventurous",
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    description:
      "The spiritual capital of India — ancient ghats on the Ganges, mesmerizing Ganga Aarti, silk weaving, and timeless temple rituals.",
    imageUrl:
      "https://images.unsplash.com/photo-1561361513-0999b1d0d0e0?auto=format&fit=crop&w=800&q=80",
    category: "Spiritual",
    rating: 4.3,
    bestTime: "October to March",
    tags: ["ghats", "ganga aarti", "temples", "spiritual"],
    isTrending: false,
    isHiddenGem: false,
    avgBudgetPerDay: 1500,
    mood: "peaceful",
  },
  {
    name: "Andaman Islands",
    state: "Andaman & Nicobar",
    description:
      "Tropical paradise — crystal-clear waters, scuba diving, Radhanagar Beach, and pristine coral reefs in the Bay of Bengal.",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    category: "Island",
    rating: 4.7,
    bestTime: "October to May",
    tags: ["scuba diving", "beaches", "coral reefs", "island"],
    isTrending: false,
    isHiddenGem: false,
    avgBudgetPerDay: 4500,
    mood: "relaxed",
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    description:
      "Yoga capital of the world — white water rafting on the Ganges, ashrams, adventure sports, and serene Himalayan foothills.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    category: "Adventure",
    rating: 4.5,
    bestTime: "September to April",
    tags: ["rafting", "yoga", "ashrams", "ganges"],
    isTrending: false,
    isHiddenGem: false,
    avgBudgetPerDay: 1800,
    mood: "energetic",
  },
  {
    name: "Darjeeling",
    state: "West Bengal",
    description:
      "Queen of the Hills — misty tea gardens, toy train rides, Kanchenjunga sunrise views, and colonial-era charm.",
    imageUrl:
      "https://images.unsplash.com/photo-1587474260587-136574528ed5?auto=format&fit=crop&w=800&q=80",
    category: "Nature",
    rating: 4.4,
    bestTime: "March to May, October to December",
    tags: ["tea gardens", "toy train", "mountains", "sunrise"],
    isTrending: false,
    isHiddenGem: false,
    avgBudgetPerDay: 2000,
    mood: "peaceful",
  },
  {
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    description:
      "A cold desert mountain valley — ancient monasteries, starry skies, remote villages, and raw Himalayan beauty at 12,000 feet.",
    imageUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    category: "Adventure",
    rating: 4.8,
    bestTime: "June to September",
    tags: ["cold desert", "monasteries", "remote", "stargazing"],
    isTrending: false,
    isHiddenGem: true,
    avgBudgetPerDay: 3500,
    mood: "adventurous",
  },
  {
    name: "Hampi",
    state: "Karnataka",
    description:
      "UNESCO World Heritage site — surreal boulder-strewn landscape with 14th-century Vijayanagara ruins and ancient temples.",
    imageUrl:
      "https://images.unsplash.com/photo-1593693397640-1857fd4e3404?auto=format&fit=crop&w=800&q=80",
    category: "Culture",
    rating: 4.6,
    bestTime: "October to February",
    tags: ["ruins", "boulders", "unesco", "history"],
    isTrending: false,
    isHiddenGem: true,
    avgBudgetPerDay: 1500,
    mood: "adventurous",
  },
  {
    name: "Majuli",
    state: "Assam",
    description:
      "World's largest river island — Neo-Vaishnavite monasteries, Mishing tribal culture, and the mighty Brahmaputra's embrace.",
    imageUrl:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    category: "Culture",
    rating: 4.5,
    bestTime: "October to March",
    tags: ["river island", "tribal culture", "monasteries", "brahmaputra"],
    isTrending: false,
    isHiddenGem: true,
    avgBudgetPerDay: 1200,
    mood: "peaceful",
  },
  {
    name: "Ziro Valley",
    state: "Arunachal Pradesh",
    description:
      "Lush pine-covered valley home to the Apatani tribe — rice paddies, bamboo forests, and the famous Ziro Music Festival.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    category: "Nature",
    rating: 4.7,
    bestTime: "March to October",
    tags: ["tribal", "music festival", "pine forests", "rice paddies"],
    isTrending: false,
    isHiddenGem: true,
    avgBudgetPerDay: 1800,
    mood: "peaceful",
  },
  {
    name: "Rann of Kutch",
    state: "Gujarat",
    description:
      "The Great White Desert — surreal salt flats, Rann Utsav festival, Kutchi handicrafts, and moonlit desert camps.",
    imageUrl:
      "https://images.unsplash.com/photo-1580619309936-0993c344d658?auto=format&fit=crop&w=800&q=80",
    category: "Culture",
    rating: 4.6,
    bestTime: "November to February",
    tags: ["desert", "rann utsav", "handicrafts", "salt flats"],
    isTrending: false,
    isHiddenGem: true,
    avgBudgetPerDay: 2000,
    mood: "adventurous",
  },
];
