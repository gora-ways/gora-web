import moment from 'moment';
import { subYears, format, differenceInMinutes, parseISO, differenceInSeconds } from 'date-fns';
import { SelectItem } from 'primereact/selectitem';

export function generateSimpleId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`; // same 9-char slice
}

export function format24Hour(date: any) {
  return moment(date, 'HH:mm:ss').format('HH:mm');
}

export function formatDate(date: any) {
  return moment(date).format('YYYY/MM/DD');
}

export function formatDateTime(date: any) {
  return moment(date).format('YYYY/MM/DD HH:mm');
}

export function formatDbDate(date: any) {
  return moment(date).format('YYYY-MM-DD');
}

export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1); // JS months are 0-based
  return date.toLocaleString('default', { month: 'long' });
}

export function currentMonthDates(): Date[] {
  const now = new Date();
  // Start of this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // End of this month
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [startOfMonth, endOfMonth];
}

export function getListOfYears() {
  const currentYear = new Date();
  return Array.from({ length: 10 }, (_, i) => format(subYears(currentYear, i), 'yyyy'));
}

export function getListOfYearOptions(): SelectItem[] {
  return getListOfYears().map((year) => ({
    label: year,
    value: Number(year)
  }));
}

export function convertDurationLabel(from: any, to: any) {
  if (!from || !to)
    return {
      label: `0`,
      duration_seconds: 0
    };

  const diffSeconds = Math.max(0, differenceInSeconds(parseISO(from), parseISO(to)));

  // Convert seconds → minutes → hours → days
  const days = Math.floor(diffSeconds / (60 * 60 * 24));
  const hours = Math.floor((diffSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((diffSeconds % (60 * 60)) / 60);
  const seconds = diffSeconds % 60;

  return {
    label: [days ? `${days}d` : '', hours ? `${hours}h` : '', minutes ? `${minutes}m` : '', seconds ? `${seconds}s` : '0s'].filter(Boolean).join(' '),
    duration_seconds: diffSeconds
  };
}

export function roundToDecimal(num: number, decimals: number) {
  // const factor = Math.pow(10, decimals);
  // return Math.round(num * factor) / factor;

  return Number(num.toFixed(decimals));
}

export const searchLocation = async (query: string) => {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=8&q=' + encodeURIComponent(query);

  const res = await fetch(url, {
    headers: {
      // Nominatim likes identifying UA; if you have a domain, set a proper one server-side.
      Accept: 'application/json'
    }
  });

  const data = await res.json();

  return data.map((x: any) => ({
    label: x.display_name,
    lat: Number(x.lat),
    lng: Number(x.lon),
    raw: x
  }));
};

export const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });

  const data = await res.json();

  return {
    label: data.display_name,
    lat: Number(data.lat),
    lng: Number(data.lon),
    raw: data
  };
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Copied!');
    })
    .catch((err) => {
      console.error('Failed to copy:', err);
    });
};

export function shareToFacebook(url: string, quote?: string) {
  const shareUrl = new URL('https://www.facebook.com/sharer/sharer.php');

  shareUrl.searchParams.set(
    'u',
    'https://gora.kevinloquencio.it.com?cln=123.9744526&cl=10.285748&rln=123.94611831222274&rl=10.27183799070544&dln=123.9779206382351&dl=10.326057955956331'
  );

  if (quote) {
    shareUrl.searchParams.set('quote', quote);
  }

  window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
}
