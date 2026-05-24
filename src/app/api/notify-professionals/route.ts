import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE = path.join(DATA_DIR, 'professional-notifications.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

async function saveToJson(entry: { email: string; city: string; province: string; createdAt: string }) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let data: any[] = [];
    try {
      const existing = await fs.readFile(JSON_FILE, 'utf-8');
      data = JSON.parse(existing);
    } catch {
      data = [];
    }
    const duplicate = data.some(
      (e: any) => e.email === entry.email && e.city === entry.city
    );
    if (duplicate) {
      return { success: true, duplicate: true };
    }
    data.push(entry);
    await fs.writeFile(JSON_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error saving to JSON:', err);
    throw err;
  }
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

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const entry = {
      email,
      city: city || 'San Luis',
      province: province || 'San Luis',
      createdAt: new Date().toISOString(),
    };

    const supabaseResult = await saveToSupabase(entry);
    if (supabaseResult) {
      return NextResponse.json(supabaseResult);
    }

    const jsonResult = await saveToJson(entry);
    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error('Error in notify-professionals:', error);
    return NextResponse.json({ error: 'Hubo un error, intentá de nuevo' }, { status: 500 });
  }
}
