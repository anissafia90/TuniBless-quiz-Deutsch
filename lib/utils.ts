import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Simple utility functions

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
