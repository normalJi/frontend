import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * tailwind className 병합용 유틸
 * @param  {...any} inputs
 */
export default function cn(...inputs) {
  return twMerge(clsx(inputs));
}
