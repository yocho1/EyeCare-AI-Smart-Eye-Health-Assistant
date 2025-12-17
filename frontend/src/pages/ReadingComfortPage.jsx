/**
 * Reading comfort page
 */
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export function ReadingComfortPage() {
  const { request, loading } = useApi();
  const [formData, setFormData] = useState({
    screen_type: 'desktop',
    ambient_light: 'normal',
    session_duration_minutes: 60,
  });
  const [recommendations, setRecommendations] = useState(null);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, [request]);

  const fetchPreferences = async () => {
    try {
      const data = await request(apiService.getUserPreferences());
      setPreferences(data);
    } catch (err) {
      console.log('Error fetching preferences:', err);
    }
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();
    try {
      const data = await request(apiService.getReadingRecommendations(formData));
      setRecommendations(data);
    } catch (err) {
      console.log('Error getting recommendations:', err);
    }
  };

  const handleSavePreferences = async (key, value) => {
    try {
      const updated = await request(
        apiService.updateUserPreferences({ [key]: value })
      );
      setPreferences(updated);
    } catch (err) {
      console.log('Error saving preference:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👁️ Reading & Screen Comfort</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommendation Form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleGetRecommendations}
              className="bg-white rounded-lg shadow p-6 sticky top-20"
            >
              <h2 className="text-xl font-bold mb-4">Get Recommendations</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Device Type</label>
                  <select
                    value={formData.screen_type}
                    onChange={(e) =>
                      setFormData({ ...formData, screen_type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="phone">📱 Phone</option>
                    <option value="tablet">📱 Tablet</option>
                    <option value="desktop">🖥️ Desktop</option>
                    <option value="book">📖 Physical Book</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Lighting</label>
                  <select
                    value={formData.ambient_light}
                    onChange={(e) =>
                      setFormData({ ...formData, ambient_light: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="dim">🌙 Dim</option>
                    <option value="normal">☀️ Normal</option>
                    <option value="bright">⚡ Bright</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Session Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.session_duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        session_duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 disabled:bg-gray-300 transition"
                >
                  {loading ? '⏳' : '✨'} Get Recommendations
                </button>
              </div>
            </form>
          </div>

          {/* Recommendations & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendations */}
            {recommendations && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">📋 Recommendations</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Font Size</p>
                    <p className="text-lg font-bold text-blue-600">
                      {recommendations.font_size}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Contrast</p>
                    <p className="text-lg font-bold text-purple-600">
                      {recommendations.contrast_level}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Line Spacing</p>
                    <p className="text-lg font-bold text-green-600">
                      {recommendations.line_spacing}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Break Interval</p>
                    <p className="text-lg font-bold text-orange-600">
                      {recommendations.recommended_break_interval}min
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div
                    className="p-8 rounded mb-4 text-center text-xl"
                    style={{
                      backgroundColor: recommendations.background_color,
                      color: recommendations.contrast_level === 'high' ? '#000' : '#666',
                    }}
                  >
                    Preview text with your settings
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-bold mb-2">💡 Tips for Comfort:</p>
                  <ul className="space-y-2">
                    {recommendations.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span>→</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* User Preferences */}
            {preferences && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">⚙️ Your Preferences</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Font Size</label>
                    <select
                      value={preferences.preferred_font_size}
                      onChange={(e) =>
                        handleSavePreferences(
                          'preferred_font_size',
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option>small</option>
                      <option>medium</option>
                      <option>large</option>
                      <option>xlarge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Contrast</label>
                    <select
                      value={preferences.preferred_contrast}
                      onChange={(e) =>
                        handleSavePreferences(
                          'preferred_contrast',
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option>normal</option>
                      <option>high</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.dark_mode}
                      onChange={(e) =>
                        handleSavePreferences('dark_mode', e.target.checked)
                      }
                    />
                    <span className="text-sm font-bold">Dark Mode</span>
                  </label>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Line Spacing
                    </label>
                    <select
                      value={preferences.preferred_line_spacing}
                      onChange={(e) =>
                        handleSavePreferences(
                          'preferred_line_spacing',
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option>normal</option>
                      <option>comfortable</option>
                      <option>spacious</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Text Width
                    </label>
                    <select
                      value={preferences.preferred_text_width}
                      onChange={(e) =>
                        handleSavePreferences(
                          'preferred_text_width',
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option>narrow</option>
                      <option>normal</option>
                      <option>wide</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
