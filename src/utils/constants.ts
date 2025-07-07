export const API_ENDPOINTS = {
  CLOUDFLARE: 'https://crimson-block-9a4c.smvrnn.workers.dev',
  LOCAL: 'http://localhost:3000',
} as const;

export const DEFAULT_API_ENDPOINT = API_ENDPOINTS.CLOUDFLARE;

export const GARAGE_PAGE_SIZE = 7;
export const WINNERS_PAGE_SIZE = 10;

export const ANIMATION_DURATION = 2000; // ms
export const RACE_TRACK_WIDTH = 500; // px

export const CAR_BRANDS = [
  'Tesla',
  'BMW',
  'Mercedes',
  'Ford',
  'Toyota',
  'Honda',
  'Audi',
  'Lexus',
  'Volvo',
  'Mazda',
] as const;

export const CAR_MODELS = [
  'Model S',
  'X5',
  'C-Class',
  'Mustang',
  'Camry',
  'Civic',
  'A4',
  'ES',
  'XC90',
  'CX-5',
] as const;

export const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
] as const;

export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch data',
  CAR_NOT_FOUND: 'Car not found',
  ENGINE_ERROR: 'Engine operation failed',
  INVALID_NAME: 'Car name cannot be empty or too long',
  ALREADY_DRIVING: 'Car is already driving',
} as const;

export const SUCCESS_MESSAGES = {
  CAR_CREATED: 'Car created successfully',
  CAR_UPDATED: 'Car updated successfully',
  CAR_DELETED: 'Car deleted successfully',
  RACE_COMPLETED: 'Race completed',
} as const;
