import { useEffect, useState } from 'react';
import {
  useAppDispatch,
  useGarageSelector,
  useRaceSelector,
} from '../hooks/redux';
import {
  fetchCars,
  createCar,
  updateCar,
  deleteCar,
  generateRandomCars,
  setCurrentPage,
  setSelectedCar,
  setEditingCar,
} from '../store/slices/garageSlice';
import { startRace, resetRace } from '../store/slices/raceSlice';
import { createWinner } from '../store/slices/winnersSlice';
import { GARAGE_PAGE_SIZE } from '../utils/constants';
import { validateCarName } from '../utils/helpers';
import CarControls from './CarControls';
import CarTrack from './CarTrack';
import Pagination from './Pagination';
import WinnerBanner from './WinnerBanner';

const GarageView = () => {
  const dispatch = useAppDispatch();
  const {
    cars,
    totalCount,
    currentPage,
    loading,
    error,
    selectedCarId,
    editingCar,
  } = useGarageSelector();

  const { isRacing, winnerId, winnerTime, winnerName } = useRaceSelector();

  const [newCarName, setNewCarName] = useState('');
  const [newCarColor, setNewCarColor] = useState('#ff0000');
  const [editCarName, setEditCarName] = useState('');
  const [editCarColor, setEditCarColor] = useState('#ff0000');

  useEffect(() => {
    dispatch(fetchCars({ page: currentPage, limit: GARAGE_PAGE_SIZE }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (editingCar) {
      setEditCarName(editingCar.name);
      setEditCarColor(editingCar.color);
    }
  }, [editingCar]);

  useEffect(() => {
    if (winnerId && winnerTime && winnerName) {
      console.log('Creating winner:', { winnerId, winnerTime, winnerName });
      // Create winner record
      dispatch(
        createWinner({
          id: winnerId,
          wins: 1,
          time: winnerTime,
        }),
      )
        .then((result) => {
          console.log('Winner creation result:', result);
        })
        .catch((error) => {
          console.error('Winner creation failed:', error);
        });
    }
  }, [winnerId, winnerTime, winnerName, dispatch]);

  const handleCreateCar = () => {
    if (!validateCarName(newCarName)) {
      alert('Please enter a valid car name (1-50 characters)');
      return;
    }

    dispatch(createCar({ name: newCarName.trim(), color: newCarColor })).then(
      () => {
        setNewCarName('');
        setNewCarColor('#ff0000');
        // Refresh current page to show new car
        dispatch(fetchCars({ page: currentPage, limit: GARAGE_PAGE_SIZE }));
      },
    );
  };

  const handleUpdateCar = () => {
    if (!editingCar) return;

    if (!validateCarName(editCarName)) {
      alert('Please enter a valid car name (1-50 characters)');
      return;
    }

    dispatch(
      updateCar({
        id: editingCar.id,
        car: { name: editCarName.trim(), color: editCarColor },
      }),
    ).then(() => {
      setEditCarName('');
      setEditCarColor('#ff0000');
      dispatch(setEditingCar(null));
    });
  };

  const handleDeleteCar = (carId: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      dispatch(deleteCar(carId)).then(() => {
        // Refresh cars list
        dispatch(fetchCars({ page: currentPage, limit: GARAGE_PAGE_SIZE }));
      });
    }
  };

  const handleSelectCar = (carId: number) => {
    const car = cars.find((c) => c.id === carId);
    if (car) {
      dispatch(setSelectedCar(carId));
      dispatch(setEditingCar(car));
    }
  };

  const handleGenerateRandomCars = () => {
    dispatch(generateRandomCars()).then(() => {
      // Refresh current page
      dispatch(fetchCars({ page: currentPage, limit: GARAGE_PAGE_SIZE }));
    });
  };

  const handleStartRace = () => {
    if (cars.length === 0) {
      alert('No cars available for racing!');
      return;
    }
    dispatch(startRace({ cars }));
  };

  const handleResetRace = () => {
    dispatch(resetRace());
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const totalPages = Math.ceil(totalCount / GARAGE_PAGE_SIZE);

  return (
    <div className="garage-view">
      <h2>Garage</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Car creation and editing panel */}
      <div className="car-control-panel">
        <div className="car-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Car name"
              value={newCarName}
              onChange={(e) => setNewCarName(e.target.value)}
              maxLength={50}
            />
            <input
              type="color"
              value={newCarColor}
              onChange={(e) => setNewCarColor(e.target.value)}
            />
            <button onClick={handleCreateCar} disabled={loading || isRacing}>
              Create
            </button>
          </div>

          <div className="form-row">
            <input
              type="text"
              placeholder="Edit car name"
              value={editCarName}
              onChange={(e) => setEditCarName(e.target.value)}
              maxLength={50}
              disabled={!editingCar}
            />
            <input
              type="color"
              value={editCarColor}
              onChange={(e) => setEditCarColor(e.target.value)}
              disabled={!editingCar}
            />
            <button
              onClick={handleUpdateCar}
              disabled={!editingCar || loading || isRacing}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Race control panel */}
      <div className="race-control-panel">
        <button
          onClick={handleStartRace}
          disabled={loading || isRacing || cars.length === 0}
          className="race-button start"
        >
          Race
        </button>
        <button
          onClick={handleResetRace}
          disabled={loading || !isRacing}
          className="race-button reset"
        >
          Reset
        </button>
        <button
          onClick={handleGenerateRandomCars}
          disabled={loading || isRacing}
          className="generate-button"
        >
          Generate Cars
        </button>
      </div>

      {/* Garage section */}
      <div className="garage-section">
        <div className="garage-stats">
          <p>Cars in garage: {totalCount}</p>
          <p>Page #{currentPage}</p>
        </div>

        {cars.length === 0 ? (
          <div className="empty-garage">
            <p>No cars in garage</p>
          </div>
        ) : (
          <div className="cars-container">
            {cars.map((car) => (
              <div key={car.id} className="car-section">
                <CarControls
                  car={car}
                  isSelected={selectedCarId === car.id}
                  isRacing={isRacing}
                  onSelect={() => handleSelectCar(car.id)}
                  onDelete={() => handleDeleteCar(car.id)}
                />
                <CarTrack car={car} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={loading || isRacing}
        />
      )}

      {/* Winner banner */}
      {winnerId && winnerName && winnerTime && (
        <WinnerBanner
          winnerName={winnerName}
          winnerTime={winnerTime}
          onClose={() => dispatch(resetRace())}
        />
      )}
    </div>
  );
};

export default GarageView;
