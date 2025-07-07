import { formatTime } from '../utils/helpers';

interface WinnerBannerProps {
  winnerName: string;
  winnerTime: number;
  onClose: () => void;
}

const WinnerBanner = ({
  winnerName,
  winnerTime,
  onClose,
}: WinnerBannerProps) => {
  return (
    <div className="winner-banner-overlay">
      <div className="winner-banner">
        <div className="winner-content">
          <div className="winner-trophy">🏆</div>
          <h2 className="winner-title">Winner!</h2>
          <div className="winner-info">
            <p className="winner-name">{winnerName}</p>
            <p className="winner-time">Time: {formatTime(winnerTime)}s</p>
          </div>
          <button className="winner-close" onClick={onClose}>
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerBanner;
