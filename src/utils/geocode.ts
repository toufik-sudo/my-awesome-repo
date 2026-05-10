/**
 * Reverse-geocode lat/lng using OpenStreetMap Nominatim (free, no API key).
 * Returns parsed address fields useful for forms.
 */
export interface ReverseGeocodeResult {
  address: string;
  city: string;
  wilaya: string;
  country: string;
  postcode?: string;
  raw?: any;
}

export async function reverseGeocode(lat: number, lng: number, lang = 'fr'): Promise<ReverseGeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${lang}&addressdetails=1`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    const city = a.city || a.town || a.village || a.municipality || a.suburb || '';
    const wilaya = a.state || a.region || a.province || a.county || '';
    const street = [a.house_number, a.road].filter(Boolean).join(' ');
    const address = street || a.neighbourhood || a.suburb || data.display_name?.split(',')[0] || '';
    return {
      address,
      city,
      wilaya,
      country: a.country || '',
      postcode: a.postcode,
      raw: data,
    };
  } catch {
    return null;
  }
}
