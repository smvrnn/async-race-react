import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Winner,
  WinnerWithCar,
  PaginationParams,
  SortBy,
  SortOrder,
} from '../../types';
import { apiService } from '../../services/api';
import { WINNERS_PAGE_SIZE } from '../../utils/constants';

interface WinnersState {
  winners: WinnerWithCar[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  sortBy: SortBy | null;
  sortOrder: SortOrder | null;
}

const initialState: WinnersState = {
  winners: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  sortBy: null,
  sortOrder: null,
};

// Async thunks
export const fetchWinners = createAsyncThunk(
  'winners/fetchWinners',
  async (params: PaginationParams & { sort?: SortBy; order?: SortOrder }) => {
    const winnersResponse = await apiService.getWinners(params);

    // Fetch car details for each winner
    const winnersWithCars = await Promise.all(
      winnersResponse.data.map(async (winner) => {
        try {
          const car = await apiService.getCar(winner.id);
          return { ...winner, car };
        } catch {
          // If car is not found, return winner with placeholder car data
          return {
            ...winner,
            car: { id: winner.id, name: 'Deleted Car', color: '#cccccc' },
          };
        }
      }),
    );

    return {
      data: winnersWithCars,
      totalCount: winnersResponse.totalCount,
    };
  },
);

export const createWinner = createAsyncThunk(
  'winners/createWinner',
  async (winner: Winner) => {
    try {
      // First check if winner already exists by getting all winners and finding by car id
      const allWinners = await apiService.getAllWinners();
      const existingWinner = allWinners.find((w: Winner) => w.id === winner.id);

      if (existingWinner) {
        // If exists, update with better stats
        const updatedWinner = {
          wins: existingWinner.wins + 1,
          time: Math.min(existingWinner.time, winner.time),
        };
        const result = await apiService.updateWinner(winner.id, updatedWinner);
        const car = await apiService.getCar(winner.id);
        return { ...result, car };
      } else {
        // If doesn't exist, create new winner
        const newWinnerData = {
          id: winner.id, // This represents car id
          wins: winner.wins,
          time: winner.time,
        };
        const newWinner = await apiService.createWinner(newWinnerData);
        const car = await apiService.getCar(winner.id);
        return { ...newWinner, car };
      }
    } catch (error) {
      console.error('Failed to create or update winner:', error);
      throw error;
    }
  },
);

export const deleteWinner = createAsyncThunk(
  'winners/deleteWinner',
  async (id: number) => {
    await apiService.deleteWinner(id);
    return id;
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: SortBy; sortOrder: SortOrder }>,
    ) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch winners
      .addCase(fetchWinners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch winners';
      })
      // Create winner
      .addCase(createWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWinner.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.winners.findIndex(
          (w) => w.id === action.payload.id,
        );
        if (existingIndex !== -1) {
          state.winners[existingIndex] = action.payload;
        } else {
          state.winners.push(action.payload);
          state.totalCount += 1;
        }
      })
      .addCase(createWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create winner';
      })
      // Delete winner
      .addCase(deleteWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = state.winners.filter((w) => w.id !== action.payload);
        state.totalCount -= 1;

        // Navigate to previous page if current page is empty
        const totalPages = Math.ceil(state.totalCount / WINNERS_PAGE_SIZE);
        if (state.currentPage > totalPages && totalPages > 0) {
          state.currentPage = totalPages;
        }
      })
      .addCase(deleteWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete winner';
      });
  },
});

export const { setCurrentPage, setSorting, clearError } = winnersSlice.actions;
export default winnersSlice.reducer;
