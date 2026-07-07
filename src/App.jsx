import Header from './components/layout/Header';
import Dashboard from './components/layout/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
