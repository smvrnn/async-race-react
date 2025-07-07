import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { driveCar, updateCarPosition } from '../store/slices/raceSlice';
import type { Car } from '../types';

interface CarTrackProps {
  car: Car;
}

const CarTrack = ({ car }: CarTrackProps) => {
  const dispatch = useAppDispatch();
  const { carAnimations, engineStates } = useAppSelector((state) => state.race);
  const carRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const carAnimation = carAnimations[car.id];
  const engineState = engineStates[car.id];
  const isEngineStarted = Boolean(engineState);

  useEffect(() => {
    console.log(`Car ${car.id}: Animation state:`, {
      isMoving: carAnimation?.isMoving,
      duration: carAnimation?.duration,
      engineStarted: isEngineStarted,
    });

    // Cancel any existing animation first
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (carAnimation?.isMoving && carAnimation?.duration && carRef.current) {
      console.log(
        `Car ${car.id}: Starting smooth time-based animation for ${carAnimation.duration}ms`,
      );

      const startTime = Date.now();
      const { duration } = carAnimation;
      const trackWidth = carRef.current.parentElement?.offsetWidth || 400;
      const maxTranslate = trackWidth - 80; // Account for car width and margins

      const animate = () => {
        // Check if animation was stopped by API
        if (!carAnimation?.isMoving) {
          console.log(`Car ${car.id}: Animation stopped by API`);
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const position = progress * 100;
        const translateX = progress * maxTranslate;

        dispatch(updateCarPosition({ carId: car.id, position }));

        if (carRef.current) {
          carRef.current.style.transform = `translateX(${translateX}px)`;
          console.log(
            `Car ${car.id}: Setting transform to translateX(${translateX}px), progress: ${progress.toFixed(2)}`,
          );
        }

        if (progress < 1 && carAnimation?.isMoving) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          console.log(`Car ${car.id}: Time-based animation completed`);
          // Animation completed by time
          dispatch(updateCarPosition({ carId: car.id, position: 100 }));
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else if (carAnimation && !carAnimation.isMoving) {
      console.log(`Car ${car.id}: Animation stopped (isMoving=false)`);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [carAnimation?.isMoving, carAnimation?.duration, car.id, dispatch]);

  useEffect(() => {
    // Reset car position only when race is reset or engine is explicitly stopped
    if (!isEngineStarted && carRef.current) {
      carRef.current.style.transform = 'translateX(0px)';
      console.log(`Car ${car.id}: Position reset - engine stopped`);
    }
  }, [isEngineStarted, car.id]);

  const handleDriveCar = () => {
    console.log(`Car ${car.id}: handleDriveCar called`, {
      isEngineStarted,
      isMoving: carAnimation?.isMoving,
    });

    if (isEngineStarted && !carAnimation?.isMoving) {
      console.log(`Car ${car.id}: Dispatching driveCar`);
      dispatch(driveCar({ carId: car.id, car }));
    }
  };

  useEffect(() => {
    // Sync visual position with Redux state position
    if (carAnimation && carRef.current) {
      const trackWidth = carRef.current.parentElement?.offsetWidth || 400;
      const maxTranslate = trackWidth - 80;
      const translateX = (carAnimation.position / 100) * maxTranslate;

      carRef.current.style.transform = `translateX(${translateX}px)`;
      console.log(
        `Car ${car.id}: Syncing position ${carAnimation.position}% -> translateX(${translateX}px)`,
      );
    }
  }, [carAnimation?.position, car.id]);

  return (
    <div className="car-track">
      <div className="track">
        <div className="start-line">🏁</div>

        <div
          ref={carRef}
          className={`car ${carAnimation?.isMoving ? 'racing' : ''}`}
          style={{ color: car.color }}
          onClick={handleDriveCar}
          title={
            isEngineStarted ? 'Click to start driving' : 'Start engine first'
          }
        >
          🏎️
        </div>

        <div className="finish-line">🏁</div>
      </div>

      <div className="track-info">
        {engineState && (
          <div className="engine-info">
            <span>Velocity: {engineState.velocity}</span>
            <span>Distance: {engineState.distance}</span>
          </div>
        )}
        {carAnimation && (
          <div className="animation-info">
            <span>Position: {carAnimation.position.toFixed(1)}%</span>
            {carAnimation.isMoving && <span>🏃 Moving</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarTrack;
