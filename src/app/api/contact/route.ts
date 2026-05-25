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
      subject: `[Contacto] ${subject} - ${email}`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fa;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:#1e3a5f;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Reparaciones Simples del Hogar</h1>
          </div>
          <div style="padding:32px;">
            <div style="border-left:4px solid #f97316;padding-left:16px;margin-bottom:24px;">
              <h2 style="margin:0;font-size:18px;color:#1e3a5f;font-weight:700;">Nuevo mensaje de contacto</h2>
              <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">Recibiste una consulta desde el formulario web</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;width:100px;">Nombre</td>
                <td style="padding:10px 12px;font-size:15px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">Email</td>
                <td style="padding:10px 12px;font-size:15px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;">${email}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e5e7eb;">Asunto</td>
                <td style="padding:10px 12px;font-size:15px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top:20px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Mensaje</p>
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;white-space:pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background:#f3f4f6;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Reparaciones Simples del Hogar &middot; Argentina</p>
          </div>
        </div>
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
