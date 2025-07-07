import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car, PaginationParams } from '../../types';
import { apiService } from '../../services/api';
import { GARAGE_PAGE_SIZE } from '../../utils/constants';

interface GarageState {
  cars: Car[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  selectedCarId: number | null;
  editingCar: Car | null;
}

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  selectedCarId: null,
  editingCar: null,
};

// Async thunks
export const fetchCars = createAsyncThunk(
  'garage/fetchCars',
  async (params: PaginationParams) => {
    const response = await apiService.getCars(params);
    return response;
  },
);

export const createCar = createAsyncThunk(
  'garage/createCar',
  async (car: Omit<Car, 'id'>) => {
    const newCar = await apiService.createCar(car);
    return newCar;
  },
);

export const updateCar = createAsyncThunk(
  'garage/updateCar',
  async ({ id, car }: { id: number; car: Omit<Car, 'id'> }) => {
    const updatedCar = await apiService.updateCar(id, car);
    return updatedCar;
  },
);

export const deleteCar = createAsyncThunk(
  'garage/deleteCar',
  async (id: number) => {
    await apiService.deleteCar(id);
    return id;
  },
);

export const generateRandomCars = createAsyncThunk(
  'garage/generateRandomCars',
  async () => {
    const { generateRandomCarName, generateRandomColor } = await import(
      '../../utils/helpers'
    );
    const promises = Array.from({ length: 100 }, () => {
      const car = {
        name: generateRandomCarName(),
        color: generateRandomColor(),
      };
      return apiService.createCar(car);
    });

    const cars = await Promise.all(promises);
    return cars;
  },
);

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<number | null>) => {
      state.selectedCarId = action.payload;
    },
    setEditingCar: (state, action: PayloadAction<Car | null>) => {
      state.editingCar = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cars
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      })
      // Create car
      .addCase(createCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create car';
      })
      // Update car
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cars.findIndex(
          (car) => car.id === action.payload.id,
        );
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        state.editingCar = null;
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update car';
      })
      // Delete car
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter((car) => car.id !== action.payload);
        state.totalCount -= 1;
        state.selectedCarId = null;
        state.editingCar = null;

        // Navigate to previous page if current page is empty
        const totalPages = Math.ceil(state.totalCount / GARAGE_PAGE_SIZE);
        if (state.currentPage > totalPages && totalPages > 0) {
          state.currentPage = totalPages;
        }
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete car';
      })
      // Generate random cars
      .addCase(generateRandomCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRandomCars.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCount += action.payload.length;
      })
      .addCase(generateRandomCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate random cars';
      });
  },
});

export const { setCurrentPage, setSelectedCar, setEditingCar, clearError } =
  garageSlice.actions;
export default garageSlice.reducer;
