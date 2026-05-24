import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE = path.join(DATA_DIR, 'professional-notifications.json');

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();
    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    let data: any[] = [];
    try {
      const existing = await fs.readFile(JSON_FILE, 'utf-8');
      data = JSON.parse(existing);
    } catch {
      return NextResponse.json({ notifications: [] });
    }

    const pending = data.filter(
      (e: any) => e.city === city && !e.notified
    );

    const emails = pending.map((e: any) => e.email);
    const updated = data.map((e: any) =>
      e.city === city && !e.notified ? { ...e, notified: true } : e
    );
    await fs.writeFile(JSON_FILE, JSON.stringify(updated, null, 2), 'utf-8');

    return NextResponse.json({
      city,
      total: emails.length,
      emails,
      subject: `¡Ya hay profesionales en ${city}!`,
      body: `Hola, te avisamos que ya tenemos profesionales matriculados disponibles en ${city}. Entrá a reparacionessimplesdelhogar.com.ar para encontrar uno cerca tuyo.`,
    });
  } catch (error) {
    console.error('Error in notify-city:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
