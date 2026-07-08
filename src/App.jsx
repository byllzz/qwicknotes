import { useState } from 'react';
import Header from './components/layout/Header';
import Dashboard from './components/layout/Dashboard';
import LandingPage from './pages/LandingPage';

function App() {
  // 'landing' | 'app'
  const [view, setView] = useState(() => {
    // If user has visited before, go straight to app
    return sessionStorage.getItem('qwicknotes_visited') ? 'app' : 'landing';
  });

  // Controls whether Dashboard should immediately open the tour
  const [startWithTour, setStartWithTour] = useState(false);

  const handleStartFromLanding = () => {
    sessionStorage.setItem('qwicknotes_visited', 'true');
    setStartWithTour(true);
    setView('app');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center m-0 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <Header />

      {view === 'landing' ? (
        <LandingPage onStart={handleStartFromLanding} />
      ) : (
        <div className="w-full max-w-[1300px] transition-colors duration-200">
          <Dashboard autoStartTour={startWithTour} />
        </div>
      )}
    </div>
  );
}

export default App;
