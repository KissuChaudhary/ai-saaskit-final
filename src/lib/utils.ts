import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createAudioContext = async ({ id }: { id: string }): Promise<AudioContext> => {
  // Check if the browser supports AudioContext
  if (typeof window !== "undefined" && "AudioContext" in window) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContext();

    // If you need to do anything with the id, you can use it here
    // For example, you might want to store the context in a map using the id as a key

    return context;
  } else {
    throw new Error("AudioContext is not supported in this browser");
  }
};

