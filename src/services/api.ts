import type {
  Car,
  Winner,
  EngineStatus,
  DriveResult,
  PaginationParams,
  ApiResponse,
  SortBy,
  SortOrder,
} from '../types';
import { EngineAction } from '../types';
import { DEFAULT_API_ENDPOINT } from '../utils/constants';

class ApiService {
  private getBaseUrl(): string {
    // Получаем текущий API URL из localStorage или используем дефолтный
    return localStorage.getItem('selectedApi') || DEFAULT_API_ENDPOINT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Cars API
  async getCars(params: PaginationParams): Promise<ApiResponse<Car>> {
    const { page, limit } = params;
    const endpoint = `/garage?_page=${page}&_limit=${limit}`;
    const baseUrl = this.getBaseUrl();

    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count')) || 0;

    return { data, totalCount };
  }

  async getCar(id: number): Promise<Car> {
    return this.request<Car>(`/garage/${id}`);
  }

  async createCar(car: Omit<Car, 'id'>): Promise<Car> {
    return this.request<Car>('/garage', {
      method: 'POST',
      body: JSON.stringify(car),
    });
  }

  async updateCar(id: number, car: Omit<Car, 'id'>): Promise<Car> {
    return this.request<Car>(`/garage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
    });
  }

  async deleteCar(id: number): Promise<void> {
    await this.request(`/garage/${id}`, { method: 'DELETE' });
  }

  // Winners API
  async getWinners(
    params: PaginationParams & {
      sort?: SortBy;
      order?: SortOrder;
    },
  ): Promise<ApiResponse<Winner>> {
    const { page, limit, sort, order } = params;
    let endpoint = `/winners?_page=${page}&_limit=${limit}`;

    if (sort && order) {
      endpoint += `&_sort=${sort}&_order=${order}`;
    }

    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count')) || 0;

    return { data, totalCount };
  }

  async getAllWinners(): Promise<Winner[]> {
    // Get all winners without pagination by using a large limit
    const baseUrl = this.getBaseUrl();
    const response = await fetch(`${baseUrl}/winners?_limit=1000`);
    return await response.json();
  }

  async getWinner(id: number): Promise<Winner> {
    try {
      return await this.request<Winner>(`/winners/${id}`);
    } catch (error) {
      // If winner doesn't exist, throw a specific error
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(`Winner with id ${id} not found`);
      }
      throw error;
    }
  }

  async createWinner(winner: Winner): Promise<Winner> {
    return this.request<Winner>('/winners', {
      method: 'POST',
      body: JSON.stringify(winner),
    });
  }

  async updateWinner(id: number, winner: Omit<Winner, 'id'>): Promise<Winner> {
    return this.request<Winner>(`/winners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(winner),
    });
  }

  async deleteWinner(id: number): Promise<void> {
    await this.request(`/winners/${id}`, { method: 'DELETE' });
  }

  // Engine API
  async startStopEngine(
    id: number,
    status: EngineAction,
  ): Promise<EngineStatus> {
    const endpoint = `/engine?id=${id}&status=${status}`;
    return this.request<EngineStatus>(endpoint, { method: 'PATCH' });
  }

  async driveMode(id: number): Promise<DriveResult> {
    const endpoint = `/engine?id=${id}&status=${EngineAction.DRIVE}`;
    return this.request<DriveResult>(endpoint, { method: 'PATCH' });
  }
}

export const apiService = new ApiService();
