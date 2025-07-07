export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  car: Car;
}

export interface EngineStatus {
  velocity: number;
  distance: number;
}

export interface DriveResult {
  success: boolean;
}

export const EngineAction = {
  STARTED: 'started',
  STOPPED: 'stopped',
  DRIVE: 'drive',
} as const;

export type EngineAction = (typeof EngineAction)[keyof typeof EngineAction];

export const SortOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const SortBy = {
  WINS: 'wins',
  TIME: 'time',
} as const;

export type SortBy = (typeof SortBy)[keyof typeof SortBy];

export interface RaceState {
  isRacing: boolean;
  winnerId: number | null;
  winnerTime: number | null;
}

export interface CarAnimationState {
  isMoving: boolean;
  position: number;
  duration: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T[];
  totalCount: number;
}
