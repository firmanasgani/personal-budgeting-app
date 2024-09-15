import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ApiUrl = () => {
  return import.meta.env.VITE_APP_URI as string;
}

export const formatNumberToRupiah = (number: number | null) => {
  if (number === null) return 'Rp. 0';
  // Use Intl.NumberFormat with Indonesian locale and currency options
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  }).format(number);
}

export const UtilToday = () => {
  const date = new Date();
  const month = date.getMonth()
  const monthNow = month < 10 ? `0${month}` : `${month}`;
  const today = `${date.getFullYear()}-${monthNow}-25`;
  return today;
}

export const DateToday = () => {
  const date = new Date();
  const month = date.getMonth() + 1
  const monthNow = month < 10 ? `0${month}` : `${month}`;
  const today = date.getDate()+1 < 10 ? `0${date.getDate()+1}`: date.getDate()
  return `${date.getFullYear()}-${monthNow}-${today}`
}

export const UtilNextMonth = () => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const monthNext = month < 10 ? `0${month}` : `${month}`;
  const next = `${date.getFullYear()}-${monthNext}-24`;
  return next;
}

export const DateFormatInput = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string | null) {
  if(dateString == null) {
    return ''
  }
  // Parse the date string
  const date = new Date(dateString);

  // Get the parts of the date
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); // Sat
  const day = date.getDate(); // 24
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase(); // aug
  const year = date.getFullYear(); // 2024

  // Combine into the desired format
  return `${dayOfWeek}, ${day} ${month} ${year}`;
}

export const UtilMonthName = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];