import { CAR_BRANDS, CAR_MODELS, COLORS } from './constants';

export const getRandomElement = <T>(array: readonly T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const generateRandomColor = (): string => {
  return getRandomElement(COLORS);
};

export const generateRandomCarName = (): string => {
  const brand = getRandomElement(CAR_BRANDS);
  const model = getRandomElement(CAR_MODELS);
  return `${brand} ${model}`;
};

export const validateCarName = (name: string): boolean => {
  const maxLength = 50;
  return name.trim().length > 0 && name.trim().length <= maxLength;
};

export const formatTime = (timeInSeconds: number): string => {
  return timeInSeconds.toFixed(2);
};

export const calculateAnimationDuration = (
  velocity: number,
  distance: number,
): number => {
  return (distance / velocity) * 1000; // Convert to milliseconds
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
