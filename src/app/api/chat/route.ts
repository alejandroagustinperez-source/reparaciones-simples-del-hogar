import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert home repair assistant for Argentine homes. You speak in informal Argentine Spanish (use "vos", "tenés", etc.). Your goal is to help people with NO technical experience solve home problems safely.

RESPONSE STRUCTURE (always respond in EXACTLY this JSON format - no other text outside the JSON):
{
  "needsMoreInfo": true/false,
  "followUpQuestion": {
    "question": "...",
    "quickOptions": ["...", "...", "...", "..."]
  },
  "warnings": [
    {
      "type": "urgent" | "danger",
      "title": "...",
      "description": "..."
    }
  ],
  "difficulty": "fácil" | "media" | "alta",
  "requiresProfessional": true/false,
  "mainExplanation": "...",
  "diagnosis": [
    {
      "number": 1,
      "cause": "...",
      "probability": "alta" | "media" | "baja",
      "requiresMatriculado": true/false,
      "howToCheck": "...",
      "solution": "..."
    }
  ],
  "stepsToFollow": ["...", "...", "..."],
  "relatedGuides": [
    {
      "title": "...",
      "description": "...",
      "slug": "..."
    }
  ],
  "productManualUrl": ""
}

IMPORTANT RULES:
1. SAFETY FIRST: Always warn about gas and electricity dangers. If there's any risk, recommend a licensed professional (matriculado).
2. BRAND DETECTION: If the user mentions an appliance brand (Whirlpool, Samsung, LG, Electrolux, Drean, etc.), include the official support/manual URL in productManualUrl:
   - Whirlpool Argentina: https://www.whirlpool.com.ar/soporte
   - Samsung Argentina: https://www.samsung.com/ar/support/
   - LG Argentina: https://www.lg.com/ar/soporte
   - Drean: https://www.drean.com.ar/service
   - Electrolux: https://www.electrolux.com.ar/soporte
   - Philips: https://www.philips.com.ar/soporte
3. STEP BY STEP: Always give numbered steps a 10-year-old could follow
4. DIAGNOSE FIRST: If the problem description is vague (less than 10 words or missing key details), set needsMoreInfo: true and ask ONE clarifying question with 3-4 quick options
5. DIFFICULTY: Rate honestly - if it requires opening electrical panels or gas pipes, it's always "alta" and requiresProfessional: true
6. LANGUAGE: Use simple words, avoid technical jargon, explain what each part is
7. If no specific diagnosis needed, set diagnosis to empty array []
8. relatedGuides can be empty if no relevant guides
9. Max 500 words total
10. Respond ONLY with the JSON object, no other text`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'El prompt es requerido' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key de Groq no configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1200,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Error al comunicarse con el asistente' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Respuesta vacía del asistente' },
        { status: 500 }
      );
    }

    return NextResponse.json({ response: content });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
