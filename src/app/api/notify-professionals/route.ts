import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('=== NOTIFY API CALLED ===');
    console.log('Body:', body);
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY?.substring(0, 8));

    const { email, city, province } = body;

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Email inválido' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY || '');

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Test - Te avisamos cuando haya profesionales en tu zona',
      html: '<p>Test email funcionando</p>',
    });

    console.log('Resend result:', JSON.stringify(result));

    if (result.error) {
      console.error('Resend error:', result.error);
      return Response.json({ error: result.error.message || 'Error de Resend' }, { status: 500 });
    }

    return Response.json({ success: true, id: result.data?.id });
  } catch (error: any) {
    console.error('=== API ERROR ===', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
