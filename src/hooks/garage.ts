import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { fetchCars } from '../store/slices/garageSlice';
import { GARAGE_PAGE_SIZE } from '../utils/constants';

export const useGaragePagination = (currentPage: number) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars({ page: currentPage, limit: GARAGE_PAGE_SIZE }));
  }, [dispatch, currentPage]);
};

export const useCarEngine = () => {
  // Car engine control hook
  // Implementation here if needed
};

export const useRaceManagement = () => {
  // Race management hook
  // Implementation here if needed
};
