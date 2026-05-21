import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Sos un asistente experto en reparaciones del hogar para usuarios en Argentina. Respondés siempre en español rioplatense (vos, tenés, etc). Estructurá la respuesta con: 1) Diagnóstico breve 2) Pasos numerados para resolverlo 3) Cuándo llamar a un profesional. IMPORTANTE: Si el problema involucra gas o electricidad de media/alta tensión, siempre recomendá llamar a un profesional matriculado. Máximo 200 palabras.`;

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
          max_tokens: 800,
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
