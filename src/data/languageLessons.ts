export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  category: string;
}

export interface LanguageLesson {
  id: string;
  language: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  vocabularyItems: VocabularyItem[];
  targetSentence: string;
  targetPhonetic: string;
  targetTranslation: string;
  culturalNote: string;
}

export const languageLessons: LanguageLesson[] = [
  // Spanish Lessons
  {
    id: 'spanish-restaurant',
    language: 'Spanish',
    title: 'Ordering at a Restaurant',
    level: 'Beginner',
    vocabularyItems: [
      { id: '1', word: 'Quiero', phonetic: 'KEH-roh', translation: 'I want', category: 'verb' },
      { id: '2', word: 'una', phonetic: 'OO-nah', translation: 'a (feminine)', category: 'article' },
      { id: '3', word: 'mesa', phonetic: 'MEH-sah', translation: 'table', category: 'noun' },
      { id: '4', word: 'para', phonetic: 'PAH-rah', translation: 'for', category: 'preposition' },
      { id: '5', word: 'dos', phonetic: 'dohs', translation: 'two', category: 'number' },
      { id: '6', word: 'personas', phonetic: 'per-SOH-nahs', translation: 'people', category: 'noun' },
    ],
    targetSentence: 'Quiero una mesa para dos personas',
    targetPhonetic: 'KEH-roh OO-nah MEH-sah PAH-rah dohs per-SOH-nahs',
    targetTranslation: 'I want a table for two people',
    culturalNote: 'In Spanish-speaking countries, it\'s common to greet the host warmly before requesting a table.'
  },
  {
    id: 'spanish-directions',
    language: 'Spanish',
    title: 'Asking for Directions',
    level: 'Beginner',
    vocabularyItems: [
      { id: '7', word: '¿Dónde', phonetic: 'DOHN-deh', translation: 'Where', category: 'question' },
      { id: '8', word: 'está', phonetic: 'ehs-TAH', translation: 'is', category: 'verb' },
      { id: '9', word: 'la', phonetic: 'lah', translation: 'the (feminine)', category: 'article' },
      { id: '10', word: 'estación', phonetic: 'ehs-tah-see-OHN', translation: 'station', category: 'noun' },
      { id: '11', word: 'de', phonetic: 'deh', translation: 'of', category: 'preposition' },
      { id: '12', word: 'metro?', phonetic: 'MEH-troh', translation: 'subway?', category: 'noun' },
    ],
    targetSentence: '¿Dónde está la estación de metro?',
    targetPhonetic: 'DOHN-deh ehs-TAH lah ehs-tah-see-OHN deh MEH-troh',
    targetTranslation: 'Where is the subway station?',
    culturalNote: 'Spanish speakers often use hand gestures when giving directions, and distances are usually given in walking time rather than blocks.'
  },

  // French Lessons
  {
    id: 'french-greeting',
    language: 'French',
    title: 'Greeting at a Café',
    level: 'Beginner',
    vocabularyItems: [
      { id: '13', word: 'Bonjour,', phonetic: 'bon-ZHOOR', translation: 'Hello,', category: 'greeting' },
      { id: '14', word: 'je', phonetic: 'zhuh', translation: 'I', category: 'pronoun' },
      { id: '15', word: 'voudrais', phonetic: 'voo-DREH', translation: 'would like', category: 'verb' },
      { id: '16', word: 'un', phonetic: 'uhn', translation: 'a (masculine)', category: 'article' },
      { id: '17', word: 'café', phonetic: 'kah-FEH', translation: 'coffee', category: 'noun' },
      { id: '18', word: 's\'il vous plaît', phonetic: 'seel voo PLEH', translation: 'please', category: 'phrase' },
    ],
    targetSentence: 'Bonjour, je voudrais un café s\'il vous plaît',
    targetPhonetic: 'bon-ZHOOR, zhuh voo-DREH uhn kah-FEH seel voo PLEH',
    targetTranslation: 'Hello, I would like a coffee please',
    culturalNote: 'In French cafés, it\'s essential to greet with "Bonjour" before making any request - it\'s considered rude not to do so.'
  },
  {
    id: 'french-shopping',
    language: 'French',
    title: 'Shopping at the Market',
    level: 'Intermediate',
    vocabularyItems: [
      { id: '19', word: 'Combien', phonetic: 'kom-bee-AHN', translation: 'How much', category: 'question' },
      { id: '20', word: 'coûtent', phonetic: 'KOOT', translation: 'cost', category: 'verb' },
      { id: '21', word: 'ces', phonetic: 'say', translation: 'these', category: 'determiner' },
      { id: '22', word: 'pommes', phonetic: 'pohm', translation: 'apples', category: 'noun' },
      { id: '23', word: 'de', phonetic: 'duh', translation: 'from', category: 'preposition' },
      { id: '24', word: 'terre?', phonetic: 'tehr', translation: 'the ground?', category: 'noun' },
    ],
    targetSentence: 'Combien coûtent ces pommes de terre?',
    targetPhonetic: 'kom-bee-AHN KOOT say pohm duh tehr',
    targetTranslation: 'How much do these potatoes cost?',
    culturalNote: 'French markets are social hubs where locals gather to chat with vendors and neighbors while shopping for fresh produce.'
  },

  // Japanese Lessons
  {
    id: 'japanese-introduction',
    language: 'Japanese',
    title: 'Self Introduction',
    level: 'Beginner',
    vocabularyItems: [
      { id: '25', word: 'はじめまして、', phonetic: 'ha-ji-me-mash-te', translation: 'Nice to meet you,', category: 'greeting' },
      { id: '26', word: '私', phonetic: 'wa-ta-shi', translation: 'I', category: 'pronoun' },
      { id: '27', word: 'は', phonetic: 'wa', translation: '(topic marker)', category: 'particle' },
      { id: '28', word: 'サラ', phonetic: 'sa-ra', translation: 'Sarah', category: 'name' },
      { id: '29', word: 'です', phonetic: 'de-su', translation: 'am/is', category: 'verb' },
    ],
    targetSentence: 'はじめまして、私はサラです',
    targetPhonetic: 'ha-ji-me-mash-te, wa-ta-shi wa sa-ra de-su',
    targetTranslation: 'Nice to meet you, I am Sarah',
    culturalNote: 'In Japan, bowing while saying はじめまして shows respect and is an important part of introductions.'
  },
  {
    id: 'japanese-sushi-order',
    language: 'Japanese',
    title: 'Ordering Sushi',
    level: 'Intermediate',
    vocabularyItems: [
      { id: '30', word: 'すみません、', phonetic: 'su-mi-ma-sen', translation: 'Excuse me,', category: 'phrase' },
      { id: '31', word: 'まぐろ', phonetic: 'ma-gu-ro', translation: 'tuna', category: 'noun' },
      { id: '32', word: 'を', phonetic: 'wo', translation: '(object marker)', category: 'particle' },
      { id: '33', word: 'ひとつ', phonetic: 'hi-to-tsu', translation: 'one piece', category: 'counter' },
      { id: '34', word: 'お願いします', phonetic: 'o-ne-gai-shi-ma-su', translation: 'please', category: 'phrase' },
    ],
    targetSentence: 'すみません、まぐろをひとつお願いします',
    targetPhonetic: 'su-mi-ma-sen, ma-gu-ro wo hi-to-tsu o-ne-gai-shi-ma-su',
    targetTranslation: 'Excuse me, one piece of tuna please',
    culturalNote: 'At sushi restaurants, it\'s common to interact directly with the chef and show appreciation for their skill.'
  },

  // Italian Lessons
  {
    id: 'italian-gelato',
    language: 'Italian',
    title: 'Ordering Gelato',
    level: 'Beginner',
    vocabularyItems: [
      { id: '35', word: 'Vorrei', phonetic: 'vor-REH-ee', translation: 'I would like', category: 'verb' },
      { id: '36', word: 'un', phonetic: 'oon', translation: 'a', category: 'article' },
      { id: '37', word: 'gelato', phonetic: 'jeh-LAH-toh', translation: 'gelato', category: 'noun' },
      { id: '38', word: 'al', phonetic: 'ahl', translation: 'with', category: 'preposition' },
      { id: '39', word: 'cioccolato', phonetic: 'chohk-koh-LAH-toh', translation: 'chocolate', category: 'noun' },
      { id: '40', word: 'per favore', phonetic: 'per fah-VOH-reh', translation: 'please', category: 'phrase' },
    ],
    targetSentence: 'Vorrei un gelato al cioccolato per favore',
    targetPhonetic: 'vor-REH-ee oon jeh-LAH-toh ahl chohk-koh-LAH-toh per fah-VOH-reh',
    targetTranslation: 'I would like a chocolate gelato please',
    culturalNote: 'In Italy, gelato is often enjoyed as an afternoon treat while taking a leisurely stroll through the piazza.'
  },

  // Chinese (Mandarin) Lessons
  {
    id: 'chinese-tea-order',
    language: 'Chinese',
    title: 'Ordering Tea',
    level: 'Beginner',
    vocabularyItems: [
      { id: '41', word: '我', phonetic: 'wǒ', translation: 'I', category: 'pronoun' },
      { id: '42', word: '要', phonetic: 'yào', translation: 'want', category: 'verb' },
      { id: '43', word: '一', phonetic: 'yī', translation: 'one', category: 'number' },
      { id: '44', word: '杯', phonetic: 'bēi', translation: 'cup', category: 'measure' },
      { id: '45', word: '绿茶', phonetic: 'lǜchá', translation: 'green tea', category: 'noun' },
    ],
    targetSentence: '我要一杯绿茶',
    targetPhonetic: 'wǒ yào yī bēi lǜchá',
    targetTranslation: 'I want a cup of green tea',
    culturalNote: 'Tea culture in China is deeply rooted in tradition, and offering tea to guests is a sign of respect and hospitality.'
  },

  // Portuguese Lessons
  {
    id: 'portuguese-beach',
    language: 'Portuguese',
    title: 'At the Beach',
    level: 'Beginner',
    vocabularyItems: [
      { id: '46', word: 'Onde', phonetic: 'ON-deh', translation: 'Where', category: 'question' },
      { id: '47', word: 'fica', phonetic: 'FEE-kah', translation: 'is located', category: 'verb' },
      { id: '48', word: 'a', phonetic: 'ah', translation: 'the', category: 'article' },
      { id: '49', word: 'praia', phonetic: 'PRAH-ee-ah', translation: 'beach', category: 'noun' },
      { id: '50', word: 'mais', phonetic: 'mahs', translation: 'most', category: 'adverb' },
      { id: '51', word: 'próxima?', phonetic: 'PROH-see-mah', translation: 'close?', category: 'adjective' },
    ],
    targetSentence: 'Onde fica a praia mais próxima?',
    targetPhonetic: 'ON-deh FEE-kah ah PRAH-ee-ah mahs PROH-see-mah',
    targetTranslation: 'Where is the closest beach?',
    culturalNote: 'Beach culture is central to Portuguese and Brazilian life, with beaches serving as social gathering places for all ages.'
  },

  // Hindi Lessons
  {
    id: 'hindi-namaste',
    language: 'Hindi',
    title: 'Traditional Greeting',
    level: 'Beginner',
    vocabularyItems: [
      { id: '52', word: 'नमस्ते,', phonetic: 'na-mas-te', translation: 'Hello/Goodbye,', category: 'greeting' },
      { id: '53', word: 'आप', phonetic: 'aap', translation: 'you (formal)', category: 'pronoun' },
      { id: '54', word: 'कैसे', phonetic: 'kai-se', translation: 'how', category: 'adverb' },
      { id: '55', word: 'हैं?', phonetic: 'hain', translation: 'are?', category: 'verb' },
    ],
    targetSentence: 'नमस्ते, आप कैसे हैं?',
    targetPhonetic: 'na-mas-te, aap kai-se hain',
    targetTranslation: 'Hello, how are you?',
    culturalNote: 'नमस्ते is accompanied by placing palms together in front of the chest, showing respect and acknowledging the divine in others.'
  },

  // Arabic Lessons
  {
    id: 'arabic-market',
    language: 'Arabic',
    title: 'Shopping at the Souk',
    level: 'Beginner',
    vocabularyItems: [
      { id: '56', word: 'كم', phonetic: 'kam', translation: 'How much', category: 'question' },
      { id: '57', word: 'سعر', phonetic: 'si\'r', translation: 'price', category: 'noun' },
      { id: '58', word: 'هذا', phonetic: 'hatha', translation: 'this', category: 'demonstrative' },
      { id: '59', word: 'القماش؟', phonetic: 'al-qumash', translation: 'fabric?', category: 'noun' },
    ],
    targetSentence: 'كم سعر هذا القماش؟',
    targetPhonetic: 'kam si\'r hatha al-qumash',
    targetTranslation: 'How much is this fabric?',
    culturalNote: 'Bargaining is an expected and respected practice in traditional Arab markets, and it\'s part of the social interaction.'
  },

  // Thai Lessons
  {
    id: 'thai-food-order',
    language: 'Thai',
    title: 'Ordering Pad Thai',
    level: 'Beginner',
    vocabularyItems: [
      { id: '60', word: 'ขอ', phonetic: 'kɔ̌ɔ', translation: 'May I have', category: 'verb' },
      { id: '61', word: 'ผัดไทย', phonetic: 'pàt tai', translation: 'Pad Thai', category: 'noun' },
      { id: '62', word: 'หนึ่ง', phonetic: 'nɯ̀ŋ', translation: 'one', category: 'number' },
      { id: '63', word: 'จาน', phonetic: 'caan', translation: 'plate', category: 'classifier' },
      { id: '64', word: 'ครับ', phonetic: 'kráp', translation: 'please (male)', category: 'particle' },
    ],
    targetSentence: 'ขอผัดไทยหนึ่งจานครับ',
    targetPhonetic: 'kɔ̌ɔ pàt tai nɯ̀ŋ caan kráp',
    targetTranslation: 'May I have one plate of Pad Thai please',
    culturalNote: 'In Thailand, meals are often shared family-style, and it\'s common to order several dishes to enjoy together.'
  },
];

export const getLessonsByLanguage = (language: string): LanguageLesson[] => {
  return languageLessons.filter(lesson => lesson.language === language);
};