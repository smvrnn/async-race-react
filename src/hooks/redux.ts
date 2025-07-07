import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed selectors
export const useGarageSelector = () => useAppSelector((state) => state.garage);
export const useWinnersSelector = () =>
  useAppSelector((state) => state.winners);
export const useRaceSelector = () => useAppSelector((state) => state.race);
