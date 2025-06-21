import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/translation-keys.ts
export type DotNestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? DotNestedKeys<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];
