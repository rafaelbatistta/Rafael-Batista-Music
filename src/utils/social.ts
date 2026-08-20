export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function instagramUrl(handle: string): string {
  const clean = handle.replace('@', '').trim();
  return `https://instagram.com/${clean}`;
}

export function facebookUrl(handle: string): string {
  const clean = handle.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').trim();
  return `https://facebook.com/${clean}`;
}

export function tiktokUrl(handle: string): string {
  const clean = handle.replace('@', '').trim();
  return `https://tiktok.com/@${clean}`;
}

export function youtubeUrl(handle: string): string {
  if (handle.startsWith('http')) return handle;
  const clean = handle.replace('@', '').trim();
  return `https://youtube.com/@${clean}`;
}
