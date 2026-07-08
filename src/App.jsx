import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Dashboard from './components/layout/Dashboard';
import AboutModal from './components/common/AboutModal';
import UserGuideTour from './components/common/UserGuideTour';

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const hasSeenTour = sessionStorage.getItem('qwicknotes_tour_seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsTourOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourFinish = () => {
    setIsTourOpen(false);
    sessionStorage.setItem('qwicknotes_tour_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center m-0 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <Header onOpenAbout={() => setIsAboutOpen(true)} onOpenTour={() => setIsTourOpen(true)} />
      <div className="w-full max-w-[1300px] transition-colors duration-200">
        <Dashboard />
      </div>
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <UserGuideTour isOpen={isTourOpen} onClose={handleTourFinish} onFinish={handleTourFinish} />
    </div>
  );
}

export default App;
