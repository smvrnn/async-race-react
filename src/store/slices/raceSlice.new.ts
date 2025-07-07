import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Car, CarAnimationState, EngineStatus } from '../../types';
import { EngineAction } from '../../types';
import { apiService } from '../../services/api';

interface RaceState {
  isRacing: boolean;
  winnerId: number | null;
  winnerTime: number | null;
  winnerName: string | null;
  loading: boolean;
  error: string | null;
  engineStates: Record<number, EngineStatus>;
  carAnimations: Record<number, CarAnimationState>;
}

const initialState: RaceState = {
  isRacing: false,
  winnerId: null,
  winnerTime: null,
  winnerName: null,
  loading: false,
  error: null,
  engineStates: {},
  carAnimations: {},
};

// Async thunks
export const startEngine = createAsyncThunk(
  'race/startEngine',
  async ({ carId }: { carId: number }) => {
    const engineStatus = await apiService.startStopEngine(
      carId,
      EngineAction.STARTED,
    );
    return { carId, engineStatus };
  },
);

export const stopEngine = createAsyncThunk(
  'race/stopEngine',
  async ({ carId }: { carId: number }) => {
    await apiService.startStopEngine(carId, EngineAction.STOPPED);
    return { carId };
  },
);

export const driveCar = createAsyncThunk(
  'race/driveCar',
  async ({ carId, car }: { carId: number; car: Car }) => {
    try {
      const driveResult = await apiService.driveMode(carId);
      return { carId, success: driveResult.success, car };
    } catch (error: unknown) {
      // Handle 500 error (engine broken)
      if (error instanceof Error && error.message.includes('500')) {
        return { carId, success: false, car, broken: true };
      }
      throw error;
    }
  },
);

export const startRace = createAsyncThunk(
  'race/startRace',
  async ({ cars }: { cars: Car[] }, { dispatch, rejectWithValue }) => {
    try {
      const startTime = Date.now();

      // Start all car engines
      const enginePromises = cars.map((car) =>
        dispatch(startEngine({ carId: car.id })),
      );

      await Promise.all(enginePromises);

      // Start driving all cars
      const drivePromises = cars.map((car) =>
        dispatch(driveCar({ carId: car.id, car })),
      );

      const results = await Promise.allSettled(drivePromises);

      // Find the first car that finished successfully
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'fulfilled') {
          const actionResult = result.value as {
            payload: { success: boolean; car: Car };
          };
          if (actionResult.payload.success) {
            const finishTime = Date.now();
            const raceTime = (finishTime - startTime) / 1000; // Convert to seconds
            return {
              winnerId: cars[i].id,
              winnerName: cars[i].name,
              winnerTime: raceTime,
            };
          }
        }
      }

      // If no car finished successfully, return null
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    setCarAnimation: (
      state,
      action: PayloadAction<{ carId: number; animation: CarAnimationState }>,
    ) => {
      const { carId, animation } = action.payload;
      state.carAnimations[carId] = animation;
    },
    updateCarPosition: (
      state,
      action: PayloadAction<{ carId: number; position: number }>,
    ) => {
      const { carId, position } = action.payload;
      if (state.carAnimations[carId]) {
        state.carAnimations[carId].position = position;
      }
    },
    resetRace: (state) => {
      state.isRacing = false;
      state.winnerId = null;
      state.winnerTime = null;
      state.winnerName = null;
      state.engineStates = {};
      state.carAnimations = {};
      state.error = null;
    },
    resetCarAnimation: (state, action: PayloadAction<{ carId: number }>) => {
      const { carId } = action.payload;
      delete state.carAnimations[carId];
      delete state.engineStates[carId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Start engine
      .addCase(startEngine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startEngine.fulfilled, (state, action) => {
        state.loading = false;
        const { carId, engineStatus } = action.payload;
        state.engineStates[carId] = engineStatus;

        // Calculate animation duration
        const duration = (engineStatus.distance / engineStatus.velocity) * 1000;

        state.carAnimations[carId] = {
          isMoving: false,
          position: 0,
          duration,
        };
      })
      .addCase(startEngine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start engine';
      })
      // Stop engine
      .addCase(stopEngine.fulfilled, (state, action) => {
        const { carId } = action.payload;
        delete state.engineStates[carId];
        state.carAnimations[carId] = {
          isMoving: false,
          position: 0,
          duration: 0,
        };
      })
      .addCase(stopEngine.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to stop engine';
      })
      // Drive car
      .addCase(driveCar.pending, (state, action) => {
        const carId = action.meta.arg.carId;
        console.log(`Race Slice: driveCar.pending for car ${carId}`);
        const animation = state.carAnimations[carId];
        if (animation) {
          animation.isMoving = true;
          console.log(`Race Slice: Set isMoving = true for car ${carId}`);
        } else {
          console.log(`Race Slice: No animation found for car ${carId}`);
        }
      })
      .addCase(driveCar.fulfilled, (state, action) => {
        const { carId, success } = action.payload;
        console.log(
          `Race Slice: driveCar.fulfilled for car ${carId}, success: ${success}`,
        );
        const animation = state.carAnimations[carId];
        if (animation) {
          if (success) {
            animation.position = 100; // Finished position
            console.log(`Race Slice: Car ${carId} finished successfully`);
          } else {
            console.log(`Race Slice: Car ${carId} broke down`);
          }
          animation.isMoving = false;
          console.log(`Race Slice: Set isMoving = false for car ${carId}`);
        }
      })
      .addCase(driveCar.rejected, (state, action) => {
        const carId = action.meta.arg.carId;
        console.log(`Race Slice: driveCar.rejected for car ${carId}`);
        const animation = state.carAnimations[carId];
        if (animation) {
          animation.isMoving = false;
          console.log(
            `Race Slice: Set isMoving = false for car ${carId} (rejected)`,
          );
        }
        state.error = action.error.message || 'Failed to drive car';
      })
      // Start race
      .addCase(startRace.pending, (state) => {
        state.isRacing = true;
        state.winnerId = null;
        state.winnerTime = null;
        state.winnerName = null;
        state.error = null;
      })
      .addCase(startRace.fulfilled, (state, action) => {
        state.isRacing = false;
        if (action.payload) {
          const { winnerId, winnerName, winnerTime } = action.payload;
          state.winnerId = winnerId;
          state.winnerName = winnerName;
          state.winnerTime = winnerTime;
        }
      })
      .addCase(startRace.rejected, (state, action) => {
        state.isRacing = false;
        state.error = action.error.message || 'Race failed';
      });
  },
});

export const {
  setCarAnimation,
  updateCarPosition,
  resetRace,
  resetCarAnimation,
} = raceSlice.actions;

export default raceSlice.reducer;
