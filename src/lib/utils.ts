import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ApiUrl = () => {
  return 'http://localhost:5000'
}

export const formatNumberToRupiah = (number: number) => {
  // Use Intl.NumberFormat with Indonesian locale and currency options
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  }).format(number);
}