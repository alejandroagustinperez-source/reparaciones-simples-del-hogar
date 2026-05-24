import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('tu-proyecto')) return null;
  return createClient(url, key);
}

async function notifyByEmail(entry: { email: string; city: string; province: string }) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || resendKey === 're_xxxxxxxx') return null;

  const { Resend } = await import('resend');
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: 'Reparaciones Simples del Hogar <noreply@reparacionessimplesdelhogar.com.ar>',
    to: entry.email,
    subject: 'Te avisamos cuando haya profesionales en tu zona',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e3a5f; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Reparaciones Simples del Hogar</h1>
        </div>
        <div style="padding: 32px; background: white;">
          <h2 style="color: #1e3a5f;">¡Registrado con éxito!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Hola, recibimos tu pedido. Te avisaremos cuando tengamos profesionales matriculados disponibles en
            <strong>${entry.city}, ${entry.province}</strong>.
          </p>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Solo te escribiremos cuando haya novedades para tu ciudad. Sin spam.
          </p>
          <div style="background: #fff7ed; border-radius: 8px; padding: 16px; margin-top: 24px;">
            <p style="color: #f97316; font-weight: 600; margin: 0;">
              Mientras tanto, podés usar nuestro asistente IA gratuito para resolver problemas del hogar vos mismo.
            </p>
          </div>
          <a href="https://reparacionessimplesdelhogar.com.ar" style="display: inline-block; margin-top: 24px; background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700;">
            Ir al sitio
          </a>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">Reparaciones Simples del Hogar · Argentina</p>
        </div>
      </div>
    `,
  });

  await resend.emails.send({
    from: 'Sistema <noreply@reparacionessimplesdelhogar.com.ar>',
    to: 'alejandro.agustin.perez@gmail.com',
    subject: `Nuevo registro: ${entry.email} quiere profesionales en ${entry.city}`,
    html: `
      <p>Nuevo registro de alerta de profesionales:</p>
      <ul>
        <li><strong>Email:</strong> ${entry.email}</li>
        <li><strong>Ciudad:</strong> ${entry.city}, ${entry.province}</li>
        <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</li>
      </ul>
    `,
  });

  return { success: true };
}

async function saveToSupabase(entry: { email: string; city: string; province: string; createdAt: string }) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from('professional_notifications')
    .select('id')
    .eq('email', entry.email)
    .eq('city', entry.city)
    .maybeSingle();

  if (existing) {
    return { success: true, duplicate: true };
  }

  const { error } = await supabase
    .from('professional_notifications')
    .insert({
      email: entry.email,
      city: entry.city,
      province: entry.province,
      created_at: entry.createdAt,
      notified: false,
    });

  if (error) throw error;
  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    const { email, city, province } = await request.json();

    console.log('notify-professionals called with:', { email, city, province });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const entry = {
      email,
      city: city || 'San Luis',
      province: province || 'San Luis',
      createdAt: new Date().toISOString(),
    };

    const emailResult = await notifyByEmail(entry);
    if (emailResult) {
      await saveToSupabase(entry);
      return NextResponse.json(emailResult);
    }

    const supabaseResult = await saveToSupabase(entry);
    if (supabaseResult) {
      return NextResponse.json(supabaseResult);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in notify-professionals:', error);
    return NextResponse.json({ error: 'Hubo un error, intentá de nuevo' }, { status: 500 });
  }
}
