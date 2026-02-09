import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if lessons already seeded
    const { count } = await supabase
      .from("language_lessons")
      .select("*", { count: "exact", head: true });

    if (count && count > 0) {
      return new Response(JSON.stringify({ message: `Already seeded with ${count} lessons` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lessons = [
      {
        language: "Spanish", title: "Ordering at a Restaurant", level: "Beginner",
        target_sentence: "Quiero una mesa para dos personas",
        target_phonetic: "KEH-roh OO-nah MEH-sah PAH-rah dohs per-SOH-nahs",
        target_translation: "I want a table for two people",
        cultural_note: "In Spanish-speaking countries, it's common to greet the host warmly before requesting a table.",
        vocabulary: [
          { word: "Quiero", phonetic: "KEH-roh", translation: "I want", category: "verb" },
          { word: "una", phonetic: "OO-nah", translation: "a (feminine)", category: "article" },
          { word: "mesa", phonetic: "MEH-sah", translation: "table", category: "noun" },
          { word: "para", phonetic: "PAH-rah", translation: "for", category: "preposition" },
          { word: "dos", phonetic: "dohs", translation: "two", category: "number" },
          { word: "personas", phonetic: "per-SOH-nahs", translation: "people", category: "noun" },
        ]
      },
      {
        language: "Spanish", title: "Asking for Directions", level: "Beginner",
        target_sentence: "¿Dónde está la estación de metro?",
        target_phonetic: "DOHN-deh ehs-TAH lah ehs-tah-see-OHN deh MEH-troh",
        target_translation: "Where is the subway station?",
        cultural_note: "Spanish speakers often use hand gestures when giving directions, and distances are usually given in walking time rather than blocks.",
        vocabulary: [
          { word: "¿Dónde", phonetic: "DOHN-deh", translation: "Where", category: "question" },
          { word: "está", phonetic: "ehs-TAH", translation: "is", category: "verb" },
          { word: "la", phonetic: "lah", translation: "the (feminine)", category: "article" },
          { word: "estación", phonetic: "ehs-tah-see-OHN", translation: "station", category: "noun" },
          { word: "de", phonetic: "deh", translation: "of", category: "preposition" },
          { word: "metro?", phonetic: "MEH-troh", translation: "subway?", category: "noun" },
        ]
      },
      {
        language: "Spanish", title: "Spanish Dance Expressions", level: "Intermediate",
        target_sentence: "¿Sabes bailar flamenco?",
        target_phonetic: "SAH-behs bai-LAR flah-MEN-koh",
        target_translation: "Do you know how to dance flamenco?",
        cultural_note: "Flamenco is deeply emotional. Each movement tells a story, and improvisation is valued over perfection.",
        vocabulary: [
          { word: "baile", phonetic: "BAI-leh", translation: "dance", category: "noun" },
          { word: "flamenco", phonetic: "flah-MEN-koh", translation: "flamenco", category: "noun" },
          { word: "compás", phonetic: "kom-PAHS", translation: "rhythm", category: "noun" },
          { word: "palmas", phonetic: "PAHL-mahs", translation: "clapping", category: "noun" },
          { word: "zapateado", phonetic: "sah-pah-teh-AH-doh", translation: "footwork", category: "noun" },
        ]
      },
      {
        language: "French", title: "Greeting at a Café", level: "Beginner",
        target_sentence: "Bonjour, je voudrais un café s'il vous plaît",
        target_phonetic: "bon-ZHOOR, zhuh voo-DREH uhn kah-FEH seel voo PLEH",
        target_translation: "Hello, I would like a coffee please",
        cultural_note: "In French cafés, it's essential to greet with 'Bonjour' before making any request - it's considered rude not to do so.",
        vocabulary: [
          { word: "Bonjour,", phonetic: "bon-ZHOOR", translation: "Hello,", category: "greeting" },
          { word: "je", phonetic: "zhuh", translation: "I", category: "pronoun" },
          { word: "voudrais", phonetic: "voo-DREH", translation: "would like", category: "verb" },
          { word: "un", phonetic: "uhn", translation: "a (masculine)", category: "article" },
          { word: "café", phonetic: "kah-FEH", translation: "coffee", category: "noun" },
          { word: "s'il vous plaît", phonetic: "seel voo PLEH", translation: "please", category: "phrase" },
        ]
      },
      {
        language: "French", title: "Shopping at the Market", level: "Intermediate",
        target_sentence: "Combien coûtent ces pommes de terre?",
        target_phonetic: "kom-bee-AHN KOOT say pohm duh tehr",
        target_translation: "How much do these potatoes cost?",
        cultural_note: "French markets are social hubs where locals gather to chat with vendors and neighbors while shopping for fresh produce.",
        vocabulary: [
          { word: "Combien", phonetic: "kom-bee-AHN", translation: "How much", category: "question" },
          { word: "coûtent", phonetic: "KOOT", translation: "cost", category: "verb" },
          { word: "ces", phonetic: "say", translation: "these", category: "determiner" },
          { word: "pommes", phonetic: "pohm", translation: "apples", category: "noun" },
          { word: "de", phonetic: "duh", translation: "from", category: "preposition" },
          { word: "terre?", phonetic: "tehr", translation: "the ground?", category: "noun" },
        ]
      },
      {
        language: "Japanese", title: "Self Introduction", level: "Beginner",
        target_sentence: "はじめまして、私はサラです",
        target_phonetic: "ha-ji-me-mash-te, wa-ta-shi wa sa-ra de-su",
        target_translation: "Nice to meet you, I am Sarah",
        cultural_note: "In Japan, bowing while saying はじめまして shows respect and is an important part of introductions.",
        vocabulary: [
          { word: "はじめまして、", phonetic: "ha-ji-me-mash-te", translation: "Nice to meet you,", category: "greeting" },
          { word: "私", phonetic: "wa-ta-shi", translation: "I", category: "pronoun" },
          { word: "は", phonetic: "wa", translation: "(topic marker)", category: "particle" },
          { word: "サラ", phonetic: "sa-ra", translation: "Sarah", category: "name" },
          { word: "です", phonetic: "de-su", translation: "am/is", category: "verb" },
        ]
      },
      {
        language: "Japanese", title: "Ordering Sushi", level: "Intermediate",
        target_sentence: "すみません、まぐろをひとつお願いします",
        target_phonetic: "su-mi-ma-sen, ma-gu-ro wo hi-to-tsu o-ne-gai-shi-ma-su",
        target_translation: "Excuse me, one piece of tuna please",
        cultural_note: "At sushi restaurants, it's common to interact directly with the chef and show appreciation for their skill.",
        vocabulary: [
          { word: "すみません、", phonetic: "su-mi-ma-sen", translation: "Excuse me,", category: "phrase" },
          { word: "まぐろ", phonetic: "ma-gu-ro", translation: "tuna", category: "noun" },
          { word: "を", phonetic: "wo", translation: "(object marker)", category: "particle" },
          { word: "ひとつ", phonetic: "hi-to-tsu", translation: "one piece", category: "counter" },
          { word: "お願いします", phonetic: "o-ne-gai-shi-ma-su", translation: "please", category: "phrase" },
        ]
      },
      {
        language: "Japanese", title: "Ordering Street Food", level: "Beginner",
        target_sentence: "ラーメンをください",
        target_phonetic: "raamen wo kudasai",
        target_translation: "Ramen please",
        cultural_note: "Bowing slightly when ordering and saying 'itadakimasu' before eating shows respect for the food and chef.",
        vocabulary: [
          { word: "ラーメン", phonetic: "raamen", translation: "ramen", category: "noun" },
          { word: "を", phonetic: "wo", translation: "(object marker)", category: "particle" },
          { word: "ください", phonetic: "kudasai", translation: "please give me", category: "phrase" },
          { word: "おいしい", phonetic: "oishii", translation: "delicious", category: "adjective" },
          { word: "いくら", phonetic: "ikura", translation: "how much", category: "question" },
        ]
      },
      {
        language: "Italian", title: "Ordering Gelato", level: "Beginner",
        target_sentence: "Vorrei un gelato al cioccolato per favore",
        target_phonetic: "vor-REH-ee oon jeh-LAH-toh ahl chohk-koh-LAH-toh per fah-VOH-reh",
        target_translation: "I would like a chocolate gelato please",
        cultural_note: "In Italy, gelato is often enjoyed as an afternoon treat while taking a leisurely stroll through the piazza.",
        vocabulary: [
          { word: "Vorrei", phonetic: "vor-REH-ee", translation: "I would like", category: "verb" },
          { word: "un", phonetic: "oon", translation: "a", category: "article" },
          { word: "gelato", phonetic: "jeh-LAH-toh", translation: "gelato", category: "noun" },
          { word: "al", phonetic: "ahl", translation: "with", category: "preposition" },
          { word: "cioccolato", phonetic: "chohk-koh-LAH-toh", translation: "chocolate", category: "noun" },
          { word: "per favore", phonetic: "per fah-VOH-reh", translation: "please", category: "phrase" },
        ]
      },
      {
        language: "Chinese", title: "Ordering Tea", level: "Beginner",
        target_sentence: "我要一杯绿茶",
        target_phonetic: "wǒ yào yī bēi lǜchá",
        target_translation: "I want a cup of green tea",
        cultural_note: "Tea culture in China is deeply rooted in tradition, and offering tea to guests is a sign of respect and hospitality.",
        vocabulary: [
          { word: "我", phonetic: "wǒ", translation: "I", category: "pronoun" },
          { word: "要", phonetic: "yào", translation: "want", category: "verb" },
          { word: "一", phonetic: "yī", translation: "one", category: "number" },
          { word: "杯", phonetic: "bēi", translation: "cup", category: "measure" },
          { word: "绿茶", phonetic: "lǜchá", translation: "green tea", category: "noun" },
        ]
      },
      {
        language: "Portuguese", title: "At the Beach", level: "Beginner",
        target_sentence: "Onde fica a praia mais próxima?",
        target_phonetic: "ON-deh FEE-kah ah PRAH-ee-ah mahs PROH-see-mah",
        target_translation: "Where is the closest beach?",
        cultural_note: "Beach culture is central to Portuguese and Brazilian life, with beaches serving as social gathering places for all ages.",
        vocabulary: [
          { word: "Onde", phonetic: "ON-deh", translation: "Where", category: "question" },
          { word: "fica", phonetic: "FEE-kah", translation: "is located", category: "verb" },
          { word: "a", phonetic: "ah", translation: "the", category: "article" },
          { word: "praia", phonetic: "PRAH-ee-ah", translation: "beach", category: "noun" },
          { word: "mais", phonetic: "mahs", translation: "most", category: "adverb" },
          { word: "próxima?", phonetic: "PROH-see-mah", translation: "close?", category: "adjective" },
        ]
      },
      {
        language: "Hindi", title: "Traditional Greeting", level: "Beginner",
        target_sentence: "नमस्ते, आप कैसे हैं?",
        target_phonetic: "na-mas-te, aap kai-se hain",
        target_translation: "Hello, how are you?",
        cultural_note: "नमस्ते is accompanied by placing palms together in front of the chest, showing respect and acknowledging the divine in others.",
        vocabulary: [
          { word: "नमस्ते,", phonetic: "na-mas-te", translation: "Hello/Goodbye,", category: "greeting" },
          { word: "आप", phonetic: "aap", translation: "you (formal)", category: "pronoun" },
          { word: "कैसे", phonetic: "kai-se", translation: "how", category: "adverb" },
          { word: "हैं?", phonetic: "hain", translation: "are?", category: "verb" },
        ]
      },
      {
        language: "Hindi", title: "Kumbh Mela Festival Traditions", level: "Intermediate",
        target_sentence: "कुंभ मेला कब है?",
        target_phonetic: "Kumbh mela kab hai?",
        target_translation: "When is Kumbh Mela?",
        cultural_note: "Kumbh Mela is the world's largest peaceful gathering. Respect for elders and spiritual leaders is paramount.",
        vocabulary: [
          { word: "स्नान", phonetic: "snaan", translation: "bathing", category: "noun" },
          { word: "पूजा", phonetic: "pooja", translation: "worship", category: "noun" },
          { word: "साधु", phonetic: "sadhu", translation: "holy man", category: "noun" },
          { word: "मेला", phonetic: "mela", translation: "festival/fair", category: "noun" },
          { word: "तीर्थ", phonetic: "teerth", translation: "pilgrimage", category: "noun" },
        ]
      },
      {
        language: "Arabic", title: "Shopping at the Souk", level: "Beginner",
        target_sentence: "كم سعر هذا القماش؟",
        target_phonetic: "kam si'r hatha al-qumash",
        target_translation: "How much is this fabric?",
        cultural_note: "Bargaining is an expected and respected practice in traditional Arab markets, and it's part of the social interaction.",
        vocabulary: [
          { word: "كم", phonetic: "kam", translation: "How much", category: "question" },
          { word: "سعر", phonetic: "si'r", translation: "price", category: "noun" },
          { word: "هذا", phonetic: "hatha", translation: "this", category: "demonstrative" },
          { word: "القماش؟", phonetic: "al-qumash", translation: "fabric?", category: "noun" },
        ]
      },
      {
        language: "Thai", title: "Ordering Pad Thai", level: "Beginner",
        target_sentence: "ขอผัดไทยหนึ่งจานครับ",
        target_phonetic: "kɔ̌ɔ pàt tai nɯ̀ŋ caan kráp",
        target_translation: "May I have one plate of Pad Thai please",
        cultural_note: "In Thailand, meals are often shared family-style, and it's common to order several dishes to enjoy together.",
        vocabulary: [
          { word: "ขอ", phonetic: "kɔ̌ɔ", translation: "May I have", category: "verb" },
          { word: "ผัดไทย", phonetic: "pàt tai", translation: "Pad Thai", category: "noun" },
          { word: "หนึ่ง", phonetic: "nɯ̀ŋ", translation: "one", category: "number" },
          { word: "จาน", phonetic: "caan", translation: "plate", category: "classifier" },
          { word: "ครับ", phonetic: "kráp", translation: "please (male)", category: "particle" },
        ]
      },
      {
        language: "English", title: "Hotel Check-in in English", level: "Beginner",
        target_sentence: "I have a reservation under my name",
        target_phonetic: "I hav a rez-er-VAY-shun UN-der my naym",
        target_translation: "I have a reservation under my name",
        cultural_note: "In English-speaking countries, it's polite to say 'please' and 'thank you' frequently during hotel interactions.",
        vocabulary: [
          { word: "reservation", phonetic: "rez-er-VAY-shun", translation: "booking", category: "noun" },
          { word: "check-in", phonetic: "CHEK-in", translation: "arrival registration", category: "noun" },
          { word: "passport", phonetic: "PASS-port", translation: "travel document", category: "noun" },
          { word: "room key", phonetic: "room kee", translation: "door opener", category: "noun" },
          { word: "receipt", phonetic: "reh-SEET", translation: "payment proof", category: "noun" },
        ]
      },
    ];

    let totalInserted = 0;

    for (const lesson of lessons) {
      const { vocabulary, ...lessonData } = lesson;
      
      const { data: inserted, error: lessonError } = await supabase
        .from("language_lessons")
        .insert(lessonData)
        .select()
        .single();

      if (lessonError) {
        console.error("Error inserting lesson:", lessonError);
        continue;
      }

      if (vocabulary.length > 0) {
        const vocabItems = vocabulary.map((v: any, idx: number) => ({
          lesson_id: inserted.id,
          word: v.word,
          phonetic: v.phonetic,
          translation: v.translation,
          category: v.category,
          sort_order: idx,
        }));

        const { error: vocabError } = await supabase
          .from("vocabulary_items")
          .insert(vocabItems);

        if (vocabError) console.error("Vocab error:", vocabError);
      }

      totalInserted++;
    }

    return new Response(JSON.stringify({ success: true, lessons_seeded: totalInserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seed error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
