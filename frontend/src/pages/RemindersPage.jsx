/**
 * Reminders page with 20-20-20 countdown and modal
 */
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useGlobalTimer } from '../hooks/useGlobalTimer';

// Sound utility to play "stop stop" alert
function playStopStopSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create "stop" sound: high pitched beep
    const playBeep = (frequency, duration, delay = 0) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration);
    };
    
    // Play "STOP STOP" pattern - two high-pitched beeps
    const now = audioContext.currentTime;
    playBeep(800, 0.3, now);        // First "STOP"
    playBeep(800, 0.3, now + 0.4);  // Second "STOP"
  } catch (err) {
    console.log('Could not play sound:', err);
  }
}

// Modal Component for 20-20-20 Rule
function TwentyTwentyModal({ isOpen, onClose, timeLeft, onComplete }) {
  if (!isOpen) return null;

  const progressPercent = ((20 - timeLeft) / 20) * 100;
  
  // Generate random angle for modal rotation (every render when open)
  const randomAngle = Math.random() * 8 - 4; // Random angle between -4 and +4 degrees
  
  // Play sound on first render (when modal opens)
  useEffect(() => {
    if (isOpen) {
      playStopStopSound();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-pulse"
        style={{
          transform: `rotate(${randomAngle}deg)`,
          transition: 'none'
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👀</div>
          <h2 className="text-3xl font-bold text-blue-600">Time for 20-20-20!</h2>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-3">Eye Care Rule:</h3>
          <ol className="space-y-2 text-sm">
            <li>👁️ <span className="font-semibold">Every 20 minutes</span></li>
            <li>🔭 <span className="font-semibold">Look 20 feet away</span></li>
            <li>⏱️ <span className="font-semibold">For 20 seconds</span></li>
          </ol>
        </div>

        {/* Timer Display - Auto closes after 20 seconds */}
        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Rest your eyes now!</p>
          <div className="text-6xl font-bold text-blue-600 font-mono mb-3">
            {timeLeft}
          </div>
          <p className="text-xs text-gray-500">
            Modal closes automatically in {timeLeft} seconds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-700">
            💡 <span className="font-semibold">Tip:</span> Find something at least 20 feet away and focus on it peacefully.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onComplete}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            ✅ Done!
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

// Countdown Timer Display Component
function CountdownDisplay({ reminder, timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (reminder.interval_minutes * 60)) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border-2 border-blue-300">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-blue-600">⏱️ Next Break In:</h4>
        <span className="text-2xl font-bold text-blue-600">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-600 mt-2 text-center">
        Get ready to look away and rest your eyes!
      </p>
    </div>
  );
}

export function RemindersPage() {
  const { request, loading } = useApi();
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    reminder_type: '20-20-20',
    interval_minutes: 20,
    use_browser_notification: true,
    notification_sound: true,
  });
  
  // Use global timer hook - persists across page navigation
  const {
    activeTimer,
    timerCountdown,
    showModal,
    modalTimeLeft,
    startTimer,
    stopTimer,
    closeModal,
    completeModal,
  } = useGlobalTimer();

  useEffect(() => {
    fetchReminders();
  }, [request]);

  const fetchReminders = async () => {
    try {
      const data = await request(apiService.getReminders());
      setReminders(data);
    } catch (err) {
      console.log('Error fetching reminders:', err);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      await request(apiService.createReminder(newReminder));
      setNewReminder({
        reminder_type: '20-20-20',
        interval_minutes: 20,
        use_browser_notification: true,
        notification_sound: true,
      });
      fetchReminders();
    } catch (err) {
      console.log('Error adding reminder:', err);
    }
  };

  const handleToggleReminder = async (reminder) => {
    try {
      await request(
        apiService.updateReminder(reminder.id, {
          is_enabled: !reminder.is_enabled,
        })
      );
      
      if (!reminder.is_enabled && activeTimer?.id === reminder.id) {
        // If disabling active timer, stop it
        stopTimer();
      } else if (reminder.is_enabled && !activeTimer) {
        // Start timer for this reminder
        startTimer(reminder);
      }
      
      fetchReminders();
    } catch (err) {
      console.log('Error updating reminder:', err);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (confirm('Delete this reminder?')) {
      try {
        await request(apiService.deleteReminder(reminderId));
        if (activeTimer?.id === reminderId) {
          stopTimer();
        }
        fetchReminders();
      } catch (err) {
        console.log('Error deleting reminder:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">⏰ Eye Health Reminders</h1>

        {/* Active Timer Display */}
        {activeTimer && (
          <div className="mb-6">
            <CountdownDisplay 
              reminder={activeTimer} 
              timeLeft={timerCountdown}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Reminder Form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleAddReminder}
              className="bg-white rounded-lg shadow p-6 sticky top-20"
            >
              <h2 className="text-xl font-bold mb-4">Create Reminder</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Type</label>
                  <select
                    value={newReminder.reminder_type}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        reminder_type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>20-20-20</option>
                    <option>Hydration</option>
                    <option>Posture Check</option>
                    <option>Blink Exercise</option>
                    <option>Eye Stretch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newReminder.interval_minutes}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        interval_minutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newReminder.use_browser_notification}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        use_browser_notification: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-bold">Browser Notification</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newReminder.notification_sound}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        notification_sound: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm font-bold">Sound Alert</span>
                </label>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 disabled:bg-gray-300 transition"
                >
                  {loading ? '⏳' : '✅'} Add Reminder
                </button>
              </div>
            </form>
          </div>

          {/* Reminders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Active Reminders</h2>

              {reminders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reminders yet. Create one to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`border rounded-lg p-4 transition ${
                        activeTimer?.id === reminder.id
                          ? 'bg-blue-100 border-blue-500 border-2 shadow-lg'
                          : reminder.is_enabled
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">
                              {reminder.reminder_type}
                            </h3>
                            {activeTimer?.id === reminder.id && (
                              <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                ⏱️ Running
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Every {reminder.interval_minutes} minutes
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!activeTimer && reminder.is_enabled && (
                            <button
                              onClick={() => startTimer(reminder)}
                              className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-bold hover:bg-blue-600 transition"
                            >
                              ▶️ Start
                            </button>
                          )}
                          {activeTimer?.id === reminder.id && (
                            <button
                              onClick={stopTimer}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm font-bold hover:bg-red-600 transition"
                            >
                              ⏹️ Stop
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleReminder(reminder)}
                            className={`px-3 py-1 rounded text-sm font-bold transition ${
                              reminder.is_enabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-500 text-white hover:bg-gray-600'
                            }`}
                          >
                            {reminder.is_enabled ? '✅ On' : '❌ Off'}
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm font-bold hover:bg-red-600 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        {reminder.use_browser_notification && (
                          <span className="inline-block mr-3">🔔 Browser</span>
                        )}
                        {reminder.notification_sound && (
                          <span className="inline-block">🔊 Sound</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-6">
              <h3 className="font-bold mb-2">💡 Reminder Tips:</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ 20-20-20 rule: Every 20 min, look 20 ft away for 20 sec</li>
                <li>✓ Start a timer to practice the habit consistently</li>
                <li>✓ Customize intervals based on your work schedule</li>
                <li>✓ Enable sound & notifications to stay on track</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 20-20-20 Modal */}
      <TwentyTwentyModal 
        isOpen={showModal}
        onClose={closeModal}
        timeLeft={modalTimeLeft}
        onComplete={completeModal}
      />
    </div>
  );
}
