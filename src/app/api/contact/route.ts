import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY || '');

    const result = await resend.emails.send({
      from: 'contacto@reparacionessimplesdelhogar.com.ar',
      to: 'alejandro.agustin.perez@gmail.com',
      reply_to: email,
      subject: `[Contacto] ${subject}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    if (result.error) {
      return Response.json({ error: result.error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
