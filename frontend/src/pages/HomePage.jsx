/**
 * Home page
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Disclaimer } from '../components/Disclaimer';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export function HomePage() {
  const { request, loading } = useApi();
  const [weeklyData, setWeeklyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request(apiService.getWeeklySummary());
        setWeeklyData(data);
      } catch (err) {
        console.log('No habit data yet');
      }
    };

    fetchData();
  }, [request]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            👁️ EyeCare AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your smart assistant for healthy eyes and comfortable digital life
          </p>
          <Disclaimer />
        </div>

        {/* Quick Stats */}
        {weeklyData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-500">
                {Math.round(weeklyData.avg_screen_time)}h
              </div>
              <p className="text-gray-600">Avg Daily Screen Time</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-500">
                {weeklyData.total_breaks}
              </div>
              <p className="text-gray-600">Breaks Taken</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-orange-500">
                {Math.round(weeklyData.avg_strain_level)}/10
              </div>
              <p className="text-gray-600">Avg Strain Level</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-500">
                {weeklyData.habit_score}/100
              </div>
              <p className="text-gray-600">Habit Score</p>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Feature 1: AI Chat */}
          <Link
            to="/chat"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer transform hover:scale-105"
          >
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold mb-2">AI Eye-Care Assistant</h3>
            <p className="text-gray-600">
              Chat with our friendly AI assistant about eye health, screen habits, and comfort tips.
            </p>
          </Link>

          {/* Feature 2: Habits */}
          <Link
            to="/habits"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Habits Tracker</h3>
            <p className="text-gray-600">
              Log your daily screen time, breaks, and eye strain to track patterns and improve habits.
            </p>
          </Link>

          {/* Feature 3: Learning */}
          <Link
            to="/learning"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-2">Learning Mode</h3>
            <p className="text-gray-600">
              Learn about how eyes work, why breaks matter, and healthy digital habits.
            </p>
          </Link>

          {/* Feature 4: Reminders */}
          <Link
            to="/reminders"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer transform hover:scale-105"
          >
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">
              Get timely reminders for the 20-20-20 rule and other healthy eye care habits.
            </p>
          </Link>

          {/* Feature 5: Reading Comfort */}
          <Link
            to="/comfort"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer transform hover:scale-105"
          >
            <div className="text-4xl mb-3">👁️</div>
            <h3 className="text-xl font-bold mb-2">Reading Comfort</h3>
            <p className="text-gray-600">
              Get personalized recommendations for font size, contrast, and optimal reading settings.
            </p>
          </Link>

          {/* Feature 6: Tips */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold mb-2">Daily Tips</h3>
            <p className="text-gray-600">
              Receive helpful eye care tips and reminders tailored to your daily routine.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Care for Your Eyes?</h2>
          <p className="text-gray-600 mb-6">
            Start by logging your first habit entry or chatting with our AI assistant.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/chat"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
            >
              💬 Start Chatting
            </Link>
            <Link
              to="/habits"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition"
            >
              📊 Log Your Habits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
