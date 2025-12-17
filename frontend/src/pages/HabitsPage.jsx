/**
 * Habits tracking page
 */
import { useState, useEffect } from 'react';
import { Disclaimer } from '../components/Disclaimer';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export function HabitsPage() {
  const { request, loading, error } = useApi();
  const [formData, setFormData] = useState({
    screen_time_hours: 8,
    breaks_taken: 2,
    break_duration_minutes: 15,
    lighting_quality: 'normal',
    eye_strain_level: 5,
    notes: '',
  });
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [request]);

  const fetchLogs = async () => {
    try {
      const data = await request(apiService.getHabitLogs());
      setLogs(data);

      const summaryData = await request(apiService.getWeeklySummary());
      setSummary(summaryData);
    } catch (err) {
      console.log('Error fetching logs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);

    try {
      await request(apiService.createHabitLog(formData));
      setSubmitted(true);
      setFormData({
        screen_time_hours: 8,
        breaks_taken: 2,
        break_duration_minutes: 15,
        lighting_quality: 'normal',
        eye_strain_level: 5,
        notes: '',
      });

      // Refresh logs
      fetchLogs();

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.log('Error submitting log:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📊 Eye Habits Tracker</h1>
        <Disclaimer />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-6 sticky top-20"
            >
              <h2 className="text-xl font-bold mb-4">Log Today's Habits</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Screen Time (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={formData.screen_time_hours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        screen_time_hours: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Breaks Taken</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.breaks_taken}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        breaks_taken: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.break_duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        break_duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Lighting Quality</label>
                  <select
                    value={formData.lighting_quality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lighting_quality: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>poor</option>
                    <option>normal</option>
                    <option>excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Eye Strain Level (1-10)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.eye_strain_level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eye_strain_level: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="font-bold">{formData.eye_strain_level}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Any observations or feelings..."
                    className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 disabled:bg-gray-300 transition"
                >
                  {loading ? '⏳ Saving...' : '✅ Save Habits'}
                </button>

                {submitted && (
                  <p className="text-green-600 text-center text-sm">
                    ✅ Habits logged successfully!
                  </p>
                )}
                {error && <p className="text-red-600 text-center text-sm">{error}</p>}
              </div>
            </form>
          </div>

          {/* Stats and Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Summary */}
            {summary && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">📈 Weekly Summary</h2>
                <p className="text-gray-700 mb-4">{summary.summary}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Habit Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.habit_score}/100
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Avg Screen Time</p>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.avg_screen_time.toFixed(1)}h
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Avg Strain</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {summary.avg_strain_level.toFixed(1)}/10
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Total Breaks</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {summary.total_breaks}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-bold mb-2">💡 Recommendations:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {summary.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Recent Logs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📋 Recent Logs</h2>
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet. Start by adding your first entry!</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-bold text-sm">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Screen: {log.screen_time_hours}h | Breaks: {log.breaks_taken} | Strain: {log.eye_strain_level}/10 | Lighting: {log.lighting_quality}
                      </p>
                      {log.notes && (
                        <p className="text-sm text-gray-700 italic mt-1">"{log.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
