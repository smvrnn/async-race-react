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

      // Start driving all cars and track which finishes first
      const drivePromises = cars.map((car, index) =>
        dispatch(driveCar({ carId: car.id, car })).then((result) => ({
          result,
          car,
          index,
          finishTime: Date.now(),
        })),
      );

      // Use Promise.race with successful results only
      const raceResults = await Promise.allSettled(drivePromises);

      // Find the earliest successful finish
      let winner = null;
      let earliestFinishTime = Infinity;

      for (const promiseResult of raceResults) {
        if (promiseResult.status === 'fulfilled') {
          const { result, car, finishTime } = promiseResult.value;

          // Check if this car finished successfully
          const actionResult = result as {
            payload: { success: boolean; car: Car };
          };
          if (actionResult.payload.success && finishTime < earliestFinishTime) {
            earliestFinishTime = finishTime;
            const raceTime = (finishTime - startTime) / 1000;
            winner = {
              winnerId: car.id,
              winnerName: car.name,
              winnerTime: raceTime,
            };
          }
        }
      }

      return winner;
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
    stopCarAnimation: (state, action: PayloadAction<{ carId: number }>) => {
      const { carId } = action.payload;
      if (state.carAnimations[carId]) {
        state.carAnimations[carId].isMoving = false;
        console.log(`Race Slice: Stopped animation for car ${carId}`);
      }
    },
    resetRace: (state) => {
      console.log('Race Slice: resetRace called - clearing all animations');
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

        // Calculate animation duration exactly like API (with Math.round, limit to maximum 30 seconds)
        const duration = Math.min(
          Math.round(engineStatus.distance / engineStatus.velocity),
          30000,
        );

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
        const { carId, success, broken } = action.payload;
        console.log(
          `Race Slice: driveCar.fulfilled for car ${carId}, success: ${success}, broken: ${broken}`,
        );
        const animation = state.carAnimations[carId];
        if (animation) {
          if (success) {
            // Car finished successfully - ensure it reaches 100% position
            animation.position = 100;
            animation.isMoving = false; // Stop animation as car has finished
            console.log(
              `Race Slice: Car ${carId} finished successfully at 100%`,
            );
          } else if (broken) {
            // Car broke down - stop animation at current position
            animation.isMoving = false;
            console.log(
              `Race Slice: Car ${carId} broke down - stopping at position ${animation.position}%`,
            );
          }
        }
      })
      .addCase(driveCar.rejected, (state, action) => {
        const carId = action.meta.arg.carId;
        console.log(`Race Slice: driveCar.rejected for car ${carId}`);
        const animation = state.carAnimations[carId];
        if (animation) {
          // Car failed completely - stop animation at current position
          animation.isMoving = false;
          console.log(
            `Race Slice: Car ${carId} drive failed - stopping animation`,
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

          console.log(
            `Race finished - winner: ${winnerName} (${winnerId}) in ${winnerTime}s`,
          );
          // Don't stop animations here - let them complete visually
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
  stopCarAnimation,
  resetRace,
  resetCarAnimation,
} = raceSlice.actions;

export default raceSlice.reducer;
