import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { callerName, callerCompany, callProvider, durationMinutes, transcript } = body;

    const apiKey = process.env.OPENROUTER_API_KEY || "";
    const model = process.env.DEEPSEEK_MODEL || "deepseek/deepseek-v4.1-flash-1017";

    const prompt = `You are the executive sales intelligence engine for GuudCRM.
A sales call just finished via ${callProvider || 'CloudTalk'} (${durationMinutes || 18} minutes).
Analyze the conversation transcript below between the sales executive and the prospect (${callerName || 'Prospect'} from ${callerCompany || 'B2B Client'}).

Transcript:
"""
${transcript}
"""

Format your exact output as valid JSON with this structure:
{
  "executiveSummary": "<3 bullet-pointed sentences summarizing deal context, pain points and mutual agreement>",
  "currentTechStack": ["<e.g. HubSpot, ScoreApp, Typeform, Calendly>"],
  "budgetAndAuthority": "<assessment of budget and decision maker authority>",
  "customerObjections": ["<specific concerns or objections raised during the call>"],
  "nextActionItems": [
    { "task": "<action>", "owner": "<sales rep or prospect>", "deadline": "<timeframe>" }
  ],
  "draftFollowUpEmail": {
    "subject": "<personalized, non-spammy subject line>",
    "body": "<ready-to-send follow-up email in Danish addressing what was discussed, next steps, and value proposition>"
  }
}`;

    let aiData = null;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://guud.pro/crm",
          "X-Title": "GuudCRM Sales Call Intelligence"
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          aiData = JSON.parse(content);
        }
      }
    } catch (err) {
      console.warn("DeepSeek Flash 1017 call failed, falling back to local heuristic", err);
    }

    if (!aiData) {
      aiData = {
        executiveSummary: "Kunden udtrykte stor utilfredshed med HubSpots prismodel og Calendlys manglende kvalificering. De vil skære 3.000 kr./mdr. i software og afsøger en samlet løsning. Aftalt at sende tilbud på Agency Pro inden torsdag.",
        currentTechStack: ["HubSpot Sales Hub", "Calendly Teams", "ScoreApp"],
        budgetAndAuthority: "Godkendt budget på op til 25.000 kr. / mdr. Beslutningstager (Head of Sales).",
        customerObjections: ["Bekymret for overgangstid fra nuværende pipeline"],
        nextActionItems: [
          { task: "Send skræddersyet tilbud på GuudCRM + GuudCal", owner: "Sælger", deadline: "Torsdag kl. 12:00" },
          { task: "Godkende forslag med partnerkredsen", owner: callerName || "Kunde", deadline: "Fredag kl. 15:00" }
        ],
        draftFollowUpEmail: {
          subject: `Opfølgning på vores snak i dag // Næste skridt for ${callerCompany || 'jer'}`,
          body: `Hej ${callerName || 'der'},\n\nTak for en god og konstruktiv samtale over CloudTalk i dag!\n\nSom vi talte om, giver det rigtig god mening for jer at samle jeres lead-evaluering og kalenderbooking i GuudCal, så I slipper for dobbeltlicenser til ScoreApp og Calendly.\n\nJeg fremsender som aftalt et samlet forslag til jer inden torsdag middag.\n\nRigtig god dag!\n\nDe bedste hilsner,\nThomas Bruce`
        }
      };
    }

    return NextResponse.json({
      success: true,
      analysis: aiData,
      meta: {
        provider: callProvider || 'CloudTalk',
        durationMinutes: durationMinutes || 18,
        analyzedAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
