import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPEN_AI_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, parentText } = await req.json();

    console.log("Generating tree content for:", { prompt, parentText });

    const systemPrompt = `You are a tool that helps users dive into deep branches of topics by generating an informative outline. Generate bullets of the outline based on what a user would naturally expect when they want to dive into a specific bullet.

## Core Principle
When someone enters a topic, they want a comprehensive set of bullets that break down the parent bullet in the natural bullets in the context the parent bullets.

## Guidelines
- Think: "What would someone naturally expect to see when exploring this topic?"
- Make clear bullets that make sense
- Generate 4-6 bullets that cover the main areas
- Keep it simple and predictable

## Formatting Rules
1. For each bullet, wrap its content between <BULLET> and </BULLET>
2. When a bullet has sub-bullets, place them between <CHILDREN> and </CHILDREN>
3. Keep bullets clear and specific (5-10 words)
4. Generate ONLY direct sub-bullets for the parent bullet

Example format:
<CHILDREN>
  <BULLET>Bullet 1</BULLET>
  <BULLET>Bullet 2</BULLET>
  <BULLET>Bullet 3</BULLET>
</CHILDREN>`;

    // Check if the parent text contains path context (indicated by " > ")
    const hasPathContext = parentText.includes(" > ");
    let userPrompt;

    if (hasPathContext) {
      // Extract the actual bullet text (the last part after ">")
      const lastBulletText = parentText.split(" > ").pop() || parentText;

      userPrompt = `Generate 4-6 sub-bullets that break down "${lastBulletText}" into its main areas.

Context: ${parentText}
Additional guidance: ${prompt}`;
    } else {
      userPrompt = `Generate 4-6 sub-bullets that break down "${parentText}" into its main areas.

Additional guidance: ${prompt}`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log("Generated content:", generatedContent);

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-tree-content function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
