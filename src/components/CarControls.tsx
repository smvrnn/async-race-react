import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { startEngine, stopEngine } from '../store/slices/raceSlice';
import type { Car } from '../types';

interface CarControlsProps {
  car: Car;
  isSelected: boolean;
  isRacing: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const CarControls = ({
  car,
  isSelected,
  isRacing,
  onSelect,
  onDelete,
}: CarControlsProps) => {
  const dispatch = useAppDispatch();
  const { carAnimations, engineStates } = useAppSelector((state) => state.race);

  const carAnimation = carAnimations[car.id];
  const engineState = engineStates[car.id];
  const isEngineStarted = Boolean(engineState);
  const isMoving = carAnimation?.isMoving || false;

  const handleStartEngine = () => {
    dispatch(startEngine({ carId: car.id }));
  };

  const handleStopEngine = () => {
    dispatch(stopEngine({ carId: car.id }));
  };

  return (
    <div className="car-controls">
      <div className="car-info">
        <h3 className="car-name">{car.name}</h3>
        <div className="car-id">#{car.id}</div>
      </div>

      <div className="control-buttons">
        <button
          onClick={handleStartEngine}
          disabled={isEngineStarted || isMoving || isRacing}
          className="engine-button start"
          title="Start engine"
        >
          ▶️ Start
        </button>

        <button
          onClick={handleStopEngine}
          disabled={!isEngineStarted || isMoving}
          className="engine-button stop"
          title="Stop engine"
        >
          ⏹️ Stop
        </button>

        <button
          onClick={onSelect}
          disabled={isRacing}
          className={`select-button ${isSelected ? 'selected' : ''}`}
          title="Select for editing"
        >
          ✏️ Select
        </button>

        <button
          onClick={onDelete}
          disabled={isRacing}
          className="delete-button"
          title="Delete car"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
};

export default CarControls;
