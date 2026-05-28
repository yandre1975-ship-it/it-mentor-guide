import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_API_URL = Deno.env.get("AI_API_URL") || "https://api.openai.com/v1/chat/completions";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gpt-4o-mini";

    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    let systemPrompt = `Ты — педагог и наставник в IT-Библиотеке. Твоя задача — не давать готовый ответ сразу, а помочь пользователю самому дойти до понимания через вопросы и аналогии.

Правила:
1. Не выдавай готовое определение в первом предложении. Задай уточняющий вопрос или предложи аналогию.
2. Если пользователь путается — вернись к более простому понятию.
3. Хвали за правильные догадки («Отличная мысль!», «Именно так!»).
4. Используй markdown. Отвечай на русском.
5. Если не знаешь ответа — честно скажи об этом.

Пример хорошего ответа:
Пользователь: "Что такое API?"
Ты: "Отличный вопрос! Давайте подумаем вместе. Вы когда-нибудь заказывали еду в ресторане? Вы смотрите меню, говорите официанту, что хотите, и получаете блюдо. Что в этой ситуации похоже на API — меню, официант или кухня?"`;

    if (context) {
      systemPrompt += `\n\nКонтекст: ${context}. Учитывай это при ответах.`;
    }

    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов, подождите немного." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Ошибка AI-сервиса" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
