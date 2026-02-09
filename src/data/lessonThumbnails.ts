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

export function getLessonThumbnail(language: string): string {
  return lessonThumbnails[language] || lessonEnglish;
}
