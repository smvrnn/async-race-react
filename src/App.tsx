import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import GarageView from './components/GarageView';
import WinnersView from './components/WinnersView';
import Navigation from './components/Navigation';
import ApiToggle from './components/ApiToggle';
import './App.css';

const View = {
  GARAGE: 'garage',
  WINNERS: 'winners',
} as const;

type View = (typeof View)[keyof typeof View];

function App() {
  const [currentView, setCurrentView] = useState<View>(View.GARAGE);

  const handleApiChange = (apiUrl: string) => {
    console.log('API changed to:', apiUrl);
    // API изменится автоматически через constants и будет подхвачен сервисом
  };

  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>🏎️ Async Race</h1>
          <div className="header-controls">
            <Navigation
              currentView={currentView}
              onViewChange={setCurrentView}
            />
            <ApiToggle onApiChange={handleApiChange} />
          </div>
        </header>
        <main className="app-main">
          {currentView === View.GARAGE && <GarageView />}
          {currentView === View.WINNERS && <WinnersView />}
        </main>
      </div>
    </Provider>
  );
}

export default App;
