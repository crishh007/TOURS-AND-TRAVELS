export interface PlaceOffer {
  badge: string;
  badgeColor: string;
  name: string;
}

export interface HotelOffer {
  hotel: string;
  discount: number;
}

export function getPlaceOffer(placeId: number): PlaceOffer | null {
  switch (placeId) {
    case 1: // Ooty
      return { badge: "🏷️ 20% Off Tour", badgeColor: "bg-emerald-500", name: "Ooty Tea Estate Tour" };
    case 4: // Munnar
      return { badge: "🍃 Free Trekking", badgeColor: "bg-teal-500", name: "Anamudi Peak Trekking" };
    case 6: // Alleppey
      return { badge: "⛵ Houseboat Deal", badgeColor: "bg-blue-500", name: "Premium Kerala Houseboat Cruise" };
    case 9: // Pondicherry
      return { badge: "🌅 Free Sunrise Surf", badgeColor: "bg-purple-500", name: "Serenity Beach Surf Session" };
    default:
      return null;
  }
}

export function getBestHotelOfferForPlace(placeId: number): HotelOffer | null {
  switch (placeId) {
    case 1:
      return { hotel: "Ooty Heritage Resort", discount: 15 };
    case 2: // Jaisalmer (Kodaikanal in original REELS but let's support Jaisalmer/Kodaikanal)
      return { hotel: "Desert Oasis Camp", discount: 25 };
    case 4:
      return { hotel: "Munnar Tea Valley resort", discount: 18 };
    case 6:
      return { hotel: "Backwater Castle Resort", discount: 20 };
    case 9:
      return { hotel: "French Quarter Villa", discount: 12 };
    default:
      return null;
  }
}
