// Generic per-language thumbnails
import lessonAmharic from "@/assets/lessons/lesson-amharic.jpg";
import lessonArabic from "@/assets/lessons/lesson-arabic.jpg";
import lessonChinese from "@/assets/lessons/lesson-chinese.jpg";
import lessonEnglish from "@/assets/lessons/lesson-english.jpg";
import lessonFrench from "@/assets/lessons/lesson-french.jpg";
import lessonGreek from "@/assets/lessons/lesson-greek.jpg";
import lessonHebrew from "@/assets/lessons/lesson-hebrew.jpg";
import lessonHindi from "@/assets/lessons/lesson-hindi.jpg";
import lessonIndonesian from "@/assets/lessons/lesson-indonesian.jpg";
import lessonItalian from "@/assets/lessons/lesson-italian.jpg";
import lessonJapanese from "@/assets/lessons/lesson-japanese.jpg";
import lessonKhmer from "@/assets/lessons/lesson-khmer.jpg";
import lessonKorean from "@/assets/lessons/lesson-korean.jpg";
import lessonMalay from "@/assets/lessons/lesson-malay.jpg";
import lessonPortuguese from "@/assets/lessons/lesson-portuguese.jpg";
import lessonSpanish from "@/assets/lessons/lesson-spanish.jpg";
import lessonSwahili from "@/assets/lessons/lesson-swahili.jpg";
import lessonThai from "@/assets/lessons/lesson-thai.jpg";
import lessonTurkish from "@/assets/lessons/lesson-turkish.jpg";
import lessonVietnamese from "@/assets/lessons/lesson-vietnamese.jpg";

// Content-specific lesson images
import arabicSoukLesson from "@/assets/arabic-souk-lesson.jpg";
import chineseTeaLesson from "@/assets/chinese-tea-lesson.jpg";
import englishHotelLesson from "@/assets/english-hotel-lesson.jpg";
import frenchCafeLesson from "@/assets/french-cafe-lesson.jpg";
import hebrewMarketLesson from "@/assets/hebrew-market-lesson.jpg";
import hindiKumbhMelaLesson from "@/assets/hindi-kumbh-mela-lesson.jpg";
import italianPiazzaLesson from "@/assets/italian-piazza-lesson.jpg";
import italianNonnaCooking from "@/assets/italian-nonna-cooking-class.jpg";
import japaneseStreetFoodLesson from "@/assets/japanese-street-food-lesson.jpg";
import japaneseTeaCeremony from "@/assets/japanese-tea-ceremony.jpg";
import khmerTempleLesson from "@/assets/khmer-temple-lesson.jpg";
import portugueseCafeLesson from "@/assets/portuguese-cafe-lesson.jpg";
import spanishDanceLesson from "@/assets/spanish-dance-lesson.jpg";
import thaiMarketLesson from "@/assets/thai-market-lesson.jpg";
import tokyoSushiWallpaper from "@/assets/tokyo-sushi-wallpaper.jpg";
import varansiTemples from "@/assets/varanasi-temples.jpg";
import mumbaiDestination from "@/assets/mumbai-destination.jpg";
import bangkokDestination from "@/assets/bangkok-destination.jpg";
import baliMonkeyForest from "@/assets/bali-monkey-forest.jpg";
import barcelonaArchitecture from "@/assets/barcelona-architecture-tour.jpg";
import parisCulture from "@/assets/paris-culture-scene.jpg";

// Newly generated content-specific images
import amharicMerkato from "@/assets/lessons/lesson-amharic-merkato.jpg";
import amharicKitchen from "@/assets/lessons/lesson-amharic-kitchen.jpg";
import greekBoat from "@/assets/lessons/lesson-greek-boat.jpg";
import greekKafeneio from "@/assets/lessons/lesson-greek-kafeneio.jpg";
import koreanGwangjang from "@/assets/lessons/lesson-korean-gwangjang.jpg";
import koreanDining from "@/assets/lessons/lesson-korean-dining.jpg";
import malayMamak from "@/assets/lessons/lesson-malay-mamak.jpg";
import malayPasar from "@/assets/lessons/lesson-malay-pasar.jpg";
import swahiliSafari from "@/assets/lessons/lesson-swahili-safari.jpg";
import swahiliMarket from "@/assets/lessons/lesson-swahili-market.jpg";
import turkishBazaar from "@/assets/lessons/lesson-turkish-bazaar.jpg";
import turkishSimit from "@/assets/lessons/lesson-turkish-simit.jpg";
import vietnamesePho from "@/assets/lessons/lesson-vietnamese-pho.jpg";
import vietnameseMarket from "@/assets/lessons/lesson-vietnamese-market.jpg";
import portugueseTasca from "@/assets/lessons/lesson-portuguese-tasca.jpg";
import arabicGreeting from "@/assets/lessons/lesson-arabic-greeting.jpg";
import chineseTemple from "@/assets/lessons/lesson-chinese-temple.jpg";
import englishStreetfood from "@/assets/lessons/lesson-english-streetfood.jpg";
import indonesianWarung from "@/assets/lessons/lesson-indonesian-warung.jpg";
import khmerLotus from "@/assets/lessons/lesson-khmer-lotus.jpg";
import hebrewFriday from "@/assets/lessons/lesson-hebrew-friday.jpg";
import thaiFloatingMarket from "@/assets/lessons/lesson-thai-floating-market.jpg";

export const lessonThumbnails: Record<string, string> = {
  Amharic: lessonAmharic,
  Arabic: lessonArabic,
  Chinese: lessonChinese,
  English: lessonEnglish,
  French: lessonFrench,
  Greek: lessonGreek,
  Hebrew: lessonHebrew,
  Hindi: lessonHindi,
  Indonesian: lessonIndonesian,
  Italian: lessonItalian,
  Japanese: lessonJapanese,
  Khmer: lessonKhmer,
  Korean: lessonKorean,
  Malay: lessonMalay,
  Portuguese: lessonPortuguese,
  Spanish: lessonSpanish,
  Swahili: lessonSwahili,
  Thai: lessonThai,
  Turkish: lessonTurkish,
  Vietnamese: lessonVietnamese,
};

/**
 * Maps specific lesson titles to content-appropriate images.
 * Key format: "Language|Title" (case-insensitive match on title keywords).
 */
const lessonTitleThumbnails: Array<{ language: string; titleKeywords: string[]; image: string }> = [
  // Amharic – each lesson gets a unique image
  { language: "Amharic", titleKeywords: ["merkato", "haggling"], image: amharicMerkato },
  { language: "Amharic", titleKeywords: ["kitchen", "ordering", "to-go", "menu"], image: amharicKitchen },
  { language: "Amharic", titleKeywords: ["greeting", "elder", "respect"], image: lessonAmharic },

  // Arabic
  { language: "Arabic", titleKeywords: ["souk", "shopping"], image: arabicSoukLesson },
  { language: "Arabic", titleKeywords: ["street food", "ordering"], image: lessonArabic },
  { language: "Arabic", titleKeywords: ["greeting", "elder", "respect"], image: arabicGreeting },

  // Chinese
  { language: "Chinese", titleKeywords: ["tea", "ordering tea"], image: chineseTeaLesson },
  { language: "Chinese", titleKeywords: ["street food", "night market"], image: lessonChinese },
  { language: "Chinese", titleKeywords: ["temple", "permission"], image: chineseTemple },

  // English
  { language: "English", titleKeywords: ["hotel", "check-in"], image: englishHotelLesson },
  { language: "English", titleKeywords: ["pub", "drink"], image: lessonEnglish },
  { language: "English", titleKeywords: ["street food"], image: englishStreetfood },

  // French
  { language: "French", titleKeywords: ["café", "cafe", "greeting"], image: frenchCafeLesson },
  { language: "French", titleKeywords: ["market", "shopping"], image: parisCulture },
  { language: "French", titleKeywords: ["bistro", "dining"], image: lessonFrench },

  // Greek – unique images per lesson
  { language: "Greek", titleKeywords: ["boat", "beach"], image: greekBoat },
  { language: "Greek", titleKeywords: ["coffee", "kafeneio"], image: greekKafeneio },
  { language: "Greek", titleKeywords: ["taverna", "seaside"], image: lessonGreek },

  // Hebrew
  { language: "Hebrew", titleKeywords: ["shuk", "tasting"], image: hebrewMarketLesson },
  { language: "Hebrew", titleKeywords: ["old city", "alley", "navigating"], image: lessonHebrew },
  { language: "Hebrew", titleKeywords: ["friday", "rush"], image: hebrewFriday },

  // Hindi
  { language: "Hindi", titleKeywords: ["kumbh", "festival"], image: hindiKumbhMelaLesson },
  { language: "Hindi", titleKeywords: ["greeting", "namaste", "traditional"], image: varansiTemples },
  { language: "Hindi", titleKeywords: ["street food", "chaat"], image: mumbaiDestination },

  // Indonesian
  { language: "Indonesian", titleKeywords: ["direction", "polite"], image: baliMonkeyForest },
  { language: "Indonesian", titleKeywords: ["bargain", "market", "pasar"], image: lessonIndonesian },
  { language: "Indonesian", titleKeywords: ["warung", "ordering", "bungkus"], image: indonesianWarung },

  // Italian
  { language: "Italian", titleKeywords: ["gelato", "ordering"], image: italianNonnaCooking },
  { language: "Italian", titleKeywords: ["direction", "asking"], image: italianPiazzaLesson },
  { language: "Italian", titleKeywords: ["salumeria", "shopping"], image: lessonItalian },

  // Japanese
  { language: "Japanese", titleKeywords: ["sushi", "ordering sushi"], image: tokyoSushiWallpaper },
  { language: "Japanese", titleKeywords: ["street food"], image: japaneseStreetFoodLesson },
  { language: "Japanese", titleKeywords: ["introduction", "self"], image: japaneseTeaCeremony },

  // Khmer
  { language: "Khmer", titleKeywords: ["temple", "etiquette", "entry"], image: khmerTempleLesson },
  { language: "Khmer", titleKeywords: ["greeting", "elder", "respect"], image: lessonKhmer },
  { language: "Khmer", titleKeywords: ["lotus", "market", "buying"], image: khmerLotus },

  // Korean – unique images per lesson
  { language: "Korean", titleKeywords: ["street food", "gwangjang"], image: koreanGwangjang },
  { language: "Korean", titleKeywords: ["dining", "family", "etiquette"], image: koreanDining },
  { language: "Korean", titleKeywords: ["temple", "buddhist", "inquiry"], image: lessonKorean },

  // Malay – unique images per lesson
  { language: "Malay", titleKeywords: ["greeting", "elder", "respect"], image: lessonMalay },
  { language: "Malay", titleKeywords: ["mamak", "ordering"], image: malayMamak },
  { language: "Malay", titleKeywords: ["pasar", "bargain", "malam"], image: malayPasar },

  // Portuguese
  { language: "Portuguese", titleKeywords: ["beach", "praia"], image: lessonPortuguese },
  { language: "Portuguese", titleKeywords: ["café", "cafe", "pastel", "mercearia"], image: portugueseCafeLesson },
  { language: "Portuguese", titleKeywords: ["tasca", "ordering"], image: portugueseTasca },

  // Spanish
  { language: "Spanish", titleKeywords: ["restaurant", "ordering"], image: lessonSpanish },
  { language: "Spanish", titleKeywords: ["direction", "asking"], image: barcelonaArchitecture },
  { language: "Spanish", titleKeywords: ["dance", "flamenco"], image: spanishDanceLesson },

  // Swahili – unique images per lesson
  { language: "Swahili", titleKeywords: ["market", "kariakoo", "negotiating"], image: swahiliMarket },
  { language: "Swahili", titleKeywords: ["greeting", "elder"], image: lessonSwahili },
  { language: "Swahili", titleKeywords: ["street food", "chipsi"], image: swahiliSafari },

  // Thai
  { language: "Thai", titleKeywords: ["pad thai", "ordering", "food"], image: thaiMarketLesson },
  { language: "Thai", titleKeywords: ["temple", "wai", "greeting", "respect"], image: bangkokDestination },
  { language: "Thai", titleKeywords: ["market", "floating", "bargain", "night"], image: thaiFloatingMarket },

  // Turkish – unique images per lesson
  { language: "Turkish", titleKeywords: ["bazaar", "market", "haggling", "rug"], image: turkishBazaar },
  { language: "Turkish", titleKeywords: ["simit", "breakfast", "ordering"], image: turkishSimit },
  { language: "Turkish", titleKeywords: ["visiting", "home", "dinner", "greeting"], image: lessonTurkish },

  // Vietnamese – unique images per lesson
  { language: "Vietnamese", titleKeywords: ["pho", "ordering", "food"], image: vietnamesePho },
  { language: "Vietnamese", titleKeywords: ["market", "ben thanh", "bargain"], image: vietnameseMarket },
  { language: "Vietnamese", titleKeywords: ["greeting", "xin chào", "elder"], image: lessonVietnamese },
];

/**
 * Get a lesson thumbnail that matches the lesson content.
 * First tries to match by language + title keywords, then falls back to generic language thumbnail.
 */
export function getLessonThumbnail(language: string, title?: string): string {
  if (title) {
    const lowerTitle = title.toLowerCase();
    const match = lessonTitleThumbnails.find(
      (entry) =>
        entry.language === language &&
        entry.titleKeywords.some((kw) => lowerTitle.includes(kw.toLowerCase()))
    );
    if (match) return match.image;
  }
  return lessonThumbnails[language] || lessonEnglish;
}
