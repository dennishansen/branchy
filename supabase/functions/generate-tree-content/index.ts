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
    const { prompt, parentText, rootIntent } = await req.json();

    console.log("Generating tree content for:", { prompt, parentText });

    const systemPrompt = `You are a tool that generates informative outlines by transforming a topic into 4-6 clear, specific sub-bullets.

## Core Principle
Convert a parent bullet into a concise set of intuitive sub-bullets covering its main aspects given the context of the parent bullet.

## Guidelines
- Identify natural subtopics from the parent bullet.
- Ensure bullets are concise (5-7 words), clear, and focused.
- Generate only immediate sub-bullets for the parent.
- If an original intent is provided, ensure all sub-bullets align with that intent while being relevant to the immediate parent.

## Formatting Rules
1. ${
      rootIntent
        ? "Maintain consistency with the original intent."
        : "First, wrap your interpretation of what the user wants to enumerate with <INTENT> and </INTENT>"
    }
2. ${rootIntent ? "Then wrap" : "Then wrap"} each bullet with <BULLET> and </BULLET>
3. If sub-bullets exist, enclose them within <CHILDREN> and </CHILDREN>

Example format:
${
  rootIntent ? "" : "<INTENT>The user wants to enumerate types of [specific thing]</INTENT>\n"
}<CHILDREN>
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

      userPrompt = `Generate 4-6 sub-bullets for "${lastBulletText}".

Context: ${parentText}${rootIntent ? `\nOriginal Intent: ${rootIntent}` : ""}
Additional guidance: ${prompt}`;
    } else {
      userPrompt = `Generate 4-6 sub-bullets for "${parentText}"${
        rootIntent ? `\nOriginal Intent: ${rootIntent}` : ""
      }
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

    // Extract intent if present
    let intent = null;
    let contentWithoutIntent = generatedContent;

    const intentMatch = generatedContent.match(/<INTENT>(.*?)<\/INTENT>/s);
    if (intentMatch) {
      intent = intentMatch[1].trim();
      // Remove the intent from the content
      contentWithoutIntent = generatedContent.replace(/<INTENT>.*?<\/INTENT>\s*/s, "");
    }

    return new Response(
      JSON.stringify({
        content: contentWithoutIntent,
        intent: intent,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-tree-content function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
