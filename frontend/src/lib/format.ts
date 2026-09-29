/** « 221770000000 » → « +221 77 000 00 00 » */
export function formatPhone(raw?: string | null) {
  if (!raw) return ''
  const d = raw.replace(/\D/g, '')
  return d.startsWith('221') && d.length === 12
    ? `+221 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`
    : `+${d}`
}

/** Lien WhatsApp avec message prérempli (https://wa.me/<numéro>?text=...). */
export function whatsappLink(number: string | undefined | null, text: string) {
  const d = (number ?? '').replace(/\D/g, '')
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}
