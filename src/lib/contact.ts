/**
 * Where users send suggestions and problems: the owner's WhatsApp (shown in
 * the app on the owner's request). wa.me takes the number with the country
 * code and no leading zero or plus.
 */
export const CONTACT_WHATSAPP = '201060911823';

/** The number as people write it in Egypt. */
export const CONTACT_WHATSAPP_DISPLAY = '01060911823';

/** A WhatsApp chat with the owner, opened with `text` already typed. */
export const whatsappLink = (text: string) => `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(text)}`;
