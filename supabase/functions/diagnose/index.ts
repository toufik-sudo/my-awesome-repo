import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VehicleContext {
  brand: string;
  model: string;
  year: number;
  engine?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages, vehicle }: { messages: Message[]; vehicle: VehicleContext } = await req.json();

    const systemPrompt = `You are an expert automotive diagnostic assistant for mechanics. You specialize in analyzing vehicle problems, interpreting diagnostic trouble codes (DTCs), and providing actionable repair guidance.

Current Vehicle Context:
- Make: ${vehicle.brand}
- Model: ${vehicle.model}
- Year: ${vehicle.year}
${vehicle.engine ? `- Engine: ${vehicle.engine}` : ""}
${vehicle.fuelType ? `- Fuel Type: ${vehicle.fuelType}` : ""}
${vehicle.transmission ? `- Transmission: ${vehicle.transmission}` : ""}
${vehicle.mileage ? `- Mileage: ${vehicle.mileage} miles` : ""}

Guidelines:
1. When analyzing DTCs, explain what each code means and its common causes for this specific vehicle
2. Provide step-by-step diagnostic procedures when relevant
3. Suggest likely root causes based on symptoms and vehicle history
4. Include safety warnings when procedures involve dangerous components
5. Reference TSBs (Technical Service Bulletins) and common issues for this make/model when relevant
6. Be concise but thorough - mechanics need actionable information`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Diagnose function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
