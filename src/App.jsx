import Header from './components/layout/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render the Header at the top */}
      <Header />

      {/* Placeholder for the rest of your dashboard (Left & Right panels) */}
      <main className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-gray-400">
        <p className="text-lg">Dashboard content (Left Panel & Right Panel) goes here next!</p>
      </main>
    </div>
  );
}

export default App;
