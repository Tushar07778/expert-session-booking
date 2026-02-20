import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ExpertsPage from './pages/ExpertsPage';
import ExpertDetailPage from './pages/ExpertDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';

/**
 * Root App component — sets up routing and wraps app in Socket.io context.
 */
function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ExpertsPage />} />
              <Route path="/experts/:id" element={<ExpertDetailPage />} />
              <Route path="/book/:expertId" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center py-32 flex-col gap-4">
                    <p className="text-8xl">🔍</p>
                    <h2 className="text-3xl font-bold text-slate-300">Page Not Found</h2>
                    <a href="/" className="btn-primary mt-2">Go Home</a>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800 py-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-slate-600 text-sm">© 2026 ExpertConnect. All rights reserved.</p>
              <p className="text-slate-700 text-xs">Built with React · Node.js · MongoDB · Socket.io</p>
            </div>
          </footer>
        </div>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
