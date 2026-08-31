import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formattedDate = (date: string | undefined) => {
  if (!date) return "--";
  return format(new Date(date), "MMMM dd, yyyy");
};
