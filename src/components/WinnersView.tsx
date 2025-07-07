import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchWinners,
  setCurrentPage,
  setSorting,
  deleteWinner,
} from '../store/slices/winnersSlice';
import { deleteCar } from '../store/slices/garageSlice';
import { WINNERS_PAGE_SIZE } from '../utils/constants';
import { formatTime } from '../utils/helpers';
import { SortBy, SortOrder } from '../types';
import Pagination from './Pagination';

const WinnersView = () => {
  const dispatch = useAppDispatch();
  const {
    winners,
    totalCount,
    currentPage,
    loading,
    error,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.winners);

  useEffect(() => {
    dispatch(
      fetchWinners({
        page: currentPage,
        limit: WINNERS_PAGE_SIZE,
        sort: sortBy || undefined,
        order: sortOrder || undefined,
      }),
    );
  }, [dispatch, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleSort = (newSortBy: SortBy) => {
    let newSortOrder: SortOrder = SortOrder.ASC;

    // Toggle sort order if clicking the same column
    if (sortBy === newSortBy && sortOrder === SortOrder.ASC) {
      newSortOrder = SortOrder.DESC;
    }

    dispatch(setSorting({ sortBy: newSortBy, sortOrder: newSortOrder }));
  };

  const handleDeleteWinner = (id: number) => {
    if (window.confirm('Are you sure you want to delete this winner?')) {
      dispatch(deleteWinner(id));
      // Also delete from garage if exists
      dispatch(deleteCar(id));
    }
  };

  const getSortIcon = (column: SortBy) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === SortOrder.ASC ? '↑' : '↓';
  };

  const totalPages = Math.ceil(totalCount / WINNERS_PAGE_SIZE);

  return (
    <div className="winners-view">
      <h2>Winners</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="winners-stats">
        <p>Winners count: {totalCount}</p>
        <p>Page #{currentPage}</p>
      </div>

      {loading ? (
        <div className="loading">Loading winners...</div>
      ) : winners.length === 0 ? (
        <div className="empty-winners">
          <p>No winners yet</p>
          <p>Complete some races to see winners here!</p>
        </div>
      ) : (
        <div className="winners-table-container">
          <table className="winners-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Car</th>
                <th>Name</th>
                <th
                  className="sortable"
                  onClick={() => handleSort(SortBy.WINS)}
                >
                  Wins {getSortIcon(SortBy.WINS)}
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort(SortBy.TIME)}
                >
                  Best Time (seconds) {getSortIcon(SortBy.TIME)}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr key={winner.id}>
                  <td>{(currentPage - 1) * WINNERS_PAGE_SIZE + index + 1}</td>
                  <td>
                    <div
                      className="car-icon"
                      style={{ color: winner.car.color }}
                    >
                      🏎️
                    </div>
                  </td>
                  <td className="car-name">{winner.car.name}</td>
                  <td className="wins">{winner.wins}</td>
                  <td className="time">{formatTime(winner.time)}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteWinner(winner.id)}
                      className="delete-button"
                      title="Delete winner"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      )}
    </div>
  );
};

export default WinnersView;
