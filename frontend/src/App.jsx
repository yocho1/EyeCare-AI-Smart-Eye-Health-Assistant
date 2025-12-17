/**
 * Main App component with routing
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { HabitsPage } from './pages/HabitsPage';
import { LearningPage } from './pages/LearningPage';
import { RemindersPage } from './pages/RemindersPage';
import { ReadingComfortPage } from './pages/ReadingComfortPage';

function App() {
  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/comfort" element={<ReadingComfortPage />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p>
          ⚠️ EyeCare AI provides educational information only. Not a substitute for professional medical advice.
        </p>
        <p className="text-sm text-gray-400">© 2024 EyeCare AI. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
