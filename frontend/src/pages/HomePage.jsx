/**
 * Home page - Professional design
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative text-center">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <span className="animate-pulse mr-2">●</span> AI-Powered Eye Care
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-6">
              EyeCare AI
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent companion for <span className="font-semibold text-blue-600">healthy vision</span> and comfortable digital living
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <Link
                to="/chat"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>💬</span> Start AI Chat
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                to="/reminders"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <span>⏰</span> Set Reminders
              </Link>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Disclaimer />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {weeklyData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-100">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {Math.round(weeklyData.avg_screen_time)}h
              </div>
              <p className="text-gray-600 font-medium">Daily Screen Time</p>
              <div className="mt-2 text-xs text-gray-400">This week average</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-100">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {weeklyData.total_breaks}
              </div>
              <p className="text-gray-600 font-medium">Breaks Taken</p>
              <div className="mt-2 text-xs text-gray-400">Keep it up! 🎉</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-100">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {Math.round(weeklyData.avg_strain_level)}/10
              </div>
              <p className="text-gray-600 font-medium">Avg Strain Level</p>
              <div className="mt-2 text-xs text-gray-400">Lower is better</div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 border border-gray-100">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {weeklyData.habit_score}
              </div>
              <p className="text-gray-600 font-medium">Habit Score</p>
              <div className="mt-2 text-xs text-gray-400">Out of 100</div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Eye Care Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to maintain healthy vision in the digital age
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: AI Chat */}
          <Link
            to="/chat"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">💬</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
              AI Assistant
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant answers about eye health, screen habits, and personalized comfort recommendations from our intelligent assistant.
            </p>
          </Link>

          {/* Feature 2: Habits */}
          <Link
            to="/habits"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">📊</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
              Habits Tracker
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor screen time, breaks, and strain levels. Visualize patterns and build healthier digital habits with data-driven insights.
            </p>
          </Link>

          {/* Feature 3: Learning */}
          <Link
            to="/learning"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">📚</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
              Learning Center
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Explore educational modules about eye anatomy, digital strain, and evidence-based practices for optimal eye health.
            </p>
          </Link>

          {/* Feature 4: Reminders */}
          <Link
            to="/reminders"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-orange-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">⏰</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors">
              Smart Reminders
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Never miss the 20-20-20 rule with customizable alerts, sounds, and browser notifications that work even outside the app.
            </p>
          </Link>

          {/* Feature 5: Reading Comfort */}
          <Link
            to="/comfort"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-indigo-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">👁️</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">
              Reading Comfort
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Optimize your reading experience with personalized font size, contrast, and brightness recommendations for any device.
            </p>
          </Link>

          {/* Feature 6: Tips */}
          <div className="group bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">✨</div>
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">Coming Soon</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Daily Tips
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive contextual eye care tips and wellness reminders tailored to your usage patterns and daily routine.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Eye Care?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands taking control of their digital eye health with AI-powered insights and personalized recommendations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/chat"
              className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              💬 Start AI Chat
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/habits"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              📊 Track Habits
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-lg mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI provides personalized recommendations based on your unique habits
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-lg mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">
                Your data stays on your device. We prioritize your privacy and security
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2">Cross-Platform</h3>
              <p className="text-gray-600 text-sm">
                Access from any device with browser notifications that work everywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
