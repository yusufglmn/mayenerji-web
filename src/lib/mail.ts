import nodemailer from "nodemailer";

const yapilandirildi = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

/** SMTP ayarlıysa bildirim maili yollar; değilse sessizce geçer (form yine de kaydedilir). */
export async function mailGonder(konu: string, html: string, yanitla?: string) {
  if (!yapilandirildi()) return { gonderildi: false, sebep: "SMTP ayarlanmamış" };
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false",
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });
    await transporter.sendMail({
      from: `"MAY Enerji Web" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      replyTo: yanitla || undefined,
      subject: konu,
      html,
    });
    return { gonderildi: true };
  } catch (e) {
    console.error("Mail gönderilemedi:", e);
    return { gonderildi: false, sebep: String(e) };
  }
}

export const satir = (k: string, v: unknown) =>
  `<tr><td style="padding:8px 14px;background:#f6f8fa;font-weight:600;color:#12355B;border-bottom:1px solid #e5e9ee">${k}</td>
       <td style="padding:8px 14px;border-bottom:1px solid #e5e9ee">${v ?? "—"}</td></tr>`;

export const tablo = (icerik: string) =>
  `<table style="border-collapse:collapse;width:100%;max-width:640px;font-family:system-ui,sans-serif;font-size:14px">${icerik}</table>`;
