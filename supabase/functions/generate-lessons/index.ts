import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { language, count = 3 } = await req.json();

    if (!language) {
      return new Response(JSON.stringify({ error: "language is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check existing lessons for this language to avoid duplicates
    const { data: existing } = await supabase
      .from("language_lessons")
      .select("title")
      .eq("language", language);

    const existingTitles = existing?.map((l: any) => l.title) || [];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a culturally sensitive language education expert for Travelogie, a travel platform that connects travelers with locals. Create authentic, practical language lessons focused on real travel scenarios that help travelers connect with local culture. Each lesson should feel like learning from a local friend.`
          },
          {
            role: "user",
            content: `Generate ${count} unique ${language} language lessons for travelers. Each lesson should be a practical travel scenario (e.g., ordering food at a local market, greeting elders, negotiating at a souk, temple etiquette, etc.).

Existing lessons to avoid duplicating: ${existingTitles.join(", ")}

Return the lessons using the suggest_lessons tool.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_lessons",
              description: "Return language lessons with vocabulary",
              parameters: {
                type: "object",
                properties: {
                  lessons: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Short descriptive title like 'Ordering at a Night Market'" },
                        level: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
                        target_sentence: { type: "string", description: "A complete sentence in the target language" },
                        target_phonetic: { type: "string", description: "Phonetic pronunciation guide" },
                        target_translation: { type: "string", description: "English translation" },
                        cultural_note: { type: "string", description: "Cultural context about when/how to use this, max 2 sentences" },
                        duration: { type: "string", description: "Estimated lesson duration like '15 min' or '25 min'" },
                        vocabulary: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              word: { type: "string" },
                              phonetic: { type: "string" },
                              translation: { type: "string" },
                              category: { type: "string", enum: ["noun", "verb", "adjective", "adverb", "greeting", "phrase", "question", "number", "article", "preposition", "pronoun", "particle", "determiner", "measure", "classifier", "counter", "demonstrative", "name"] }
                            },
                            required: ["word", "phonetic", "translation", "category"]
                          }
                        }
                      },
                      required: ["title", "level", "target_sentence", "target_phonetic", "target_translation", "cultural_note", "duration", "vocabulary"]
                    }
                  }
                },
                required: ["lessons"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_lessons" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const { lessons } = JSON.parse(toolCall.function.arguments);
    const insertedLessons: any[] = [];

    for (const lesson of lessons) {
      // Insert the lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("language_lessons")
        .insert({
          language,
          title: lesson.title,
          level: lesson.level,
          target_sentence: lesson.target_sentence,
          target_phonetic: lesson.target_phonetic,
          target_translation: lesson.target_translation,
          cultural_note: lesson.cultural_note,
          duration: lesson.duration,
        })
        .select()
        .single();

      if (lessonError) {
        console.error("Lesson insert error:", lessonError);
        continue;
      }

      // Insert vocabulary items
      if (lesson.vocabulary?.length > 0) {
        const vocabItems = lesson.vocabulary.map((v: any, idx: number) => ({
          lesson_id: lessonData.id,
          word: v.word,
          phonetic: v.phonetic,
          translation: v.translation,
          category: v.category,
          sort_order: idx,
        }));

        const { error: vocabError } = await supabase
          .from("vocabulary_items")
          .insert(vocabItems);

        if (vocabError) console.error("Vocab insert error:", vocabError);
      }

      insertedLessons.push(lessonData);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      lessons_created: insertedLessons.length,
      lessons: insertedLessons 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("generate-lessons error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
