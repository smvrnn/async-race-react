interface NavigationProps {
  currentView: string;
  onViewChange: (view: 'garage' | 'winners') => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentView === 'garage' ? 'active' : ''}`}
        onClick={() => onViewChange('garage')}
      >
        Garage
      </button>
      <button
        className={`nav-button ${currentView === 'winners' ? 'active' : ''}`}
        onClick={() => onViewChange('winners')}
      >
        Winners
      </button>
    </nav>
  );
};

export default Navigation;
