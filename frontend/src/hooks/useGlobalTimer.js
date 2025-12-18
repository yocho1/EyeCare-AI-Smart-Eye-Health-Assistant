/**
 * Global timer hook that persists across page navigation
 */
import { useState, useEffect } from 'react'

let globalTimerState = {
  activeTimer: null,
  timerCountdown: 0,
  timerStartTime: null,
  showModal: false,
  modalTimeLeft: 20,
}

let listeners = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener(globalTimerState))
}

export function useGlobalTimer() {
  const [state, setState] = useState(globalTimerState)

  useEffect(() => {
    // Add this component as a listener
    const listener = (newState) => setState({ ...newState })
    listeners.push(listener)

    // Load timer state on mount
    loadTimerState()

    return () => {
      // Remove listener on unmount
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  // Main timer effect - runs continuously
  useEffect(() => {
    if (!globalTimerState.activeTimer || !globalTimerState.timerStartTime)
      return

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (Date.now() - globalTimerState.timerStartTime) / 1000
      )
      const totalSeconds = globalTimerState.activeTimer.interval_minutes * 60
      const remaining = Math.max(0, totalSeconds - elapsedSeconds)

      globalTimerState.timerCountdown = remaining
      notifyListeners()

      if (remaining === 0 && !globalTimerState.showModal) {
        // Timer finished - show modal
        globalTimerState.showModal = true
        globalTimerState.modalTimeLeft = 20
        notifyListeners()

        // Play "STOP STOP" sound if enabled
        if (globalTimerState.activeTimer.notification_sound) {
          try {
            const audioContext = new (window.AudioContext ||
              window.webkitAudioContext)()

            // Play two beeps saying "STOP STOP"
            const playBeep = (frequency, duration, delay = 0) => {
              const oscillator = audioContext.createOscillator()
              const gainNode = audioContext.createGain()
              oscillator.connect(gainNode)
              gainNode.connect(audioContext.destination)
              oscillator.frequency.value = frequency
              oscillator.type = 'sine'
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + duration
              )
              oscillator.start(audioContext.currentTime + delay)
              oscillator.stop(audioContext.currentTime + delay + duration)
            }

            const now = audioContext.currentTime
            playBeep(800, 0.3, now) // First "STOP"
            playBeep(800, 0.3, now + 0.4) // Second "STOP"
          } catch (e) {
            console.log('Audio playback failed:', e)
          }
        }

        // Browser notification if enabled (works even when app is not in focus)
        if (
          globalTimerState.activeTimer.use_browser_notification &&
          'Notification' in window
        ) {
          if (Notification.permission === 'granted') {
            const notification = new Notification(
              '🎯 STOP! Time for 20-20-20!',
              {
                body: 'Look away now! Find something 20 feet away for 20 seconds.',
                icon: '👀',
                tag: 'eyecare-20-20-20',
                requireInteraction: true, // Keep notification visible until user interacts
              }
            )

            // Play sound again through notification click to ensure it's heard
            notification.onclick = () => {
              window.focus()
              notification.close()
            }
          }
        }

        saveTimerState(globalTimerState.activeTimer, 0, true)
      } else if (remaining > 0) {
        saveTimerState(globalTimerState.activeTimer, remaining, false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state.activeTimer, state.timerStartTime, state.showModal])

  // Modal countdown effect
  useEffect(() => {
    if (!globalTimerState.showModal) return

    const interval = setInterval(() => {
      globalTimerState.modalTimeLeft -= 1
      notifyListeners()

      if (globalTimerState.modalTimeLeft <= 0) {
        // Modal time finished - auto close and restart timer
        clearInterval(interval)
        globalTimerState.showModal = false

        // Automatically restart the timer for next cycle
        if (globalTimerState.activeTimer) {
          const now = Date.now()
          globalTimerState.timerStartTime = now
          globalTimerState.timerCountdown =
            globalTimerState.activeTimer.interval_minutes * 60
          saveTimerState(
            globalTimerState.activeTimer,
            globalTimerState.activeTimer.interval_minutes * 60,
            false
          )
        }

        globalTimerState.modalTimeLeft = 20
        notifyListeners()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state.showModal])

  const startTimer = (reminder) => {
    const now = Date.now()
    globalTimerState.activeTimer = reminder
    globalTimerState.timerCountdown = reminder.interval_minutes * 60
    globalTimerState.timerStartTime = now
    globalTimerState.showModal = false
    notifyListeners()

    saveTimerState(reminder, reminder.interval_minutes * 60, false)
  }

  const stopTimer = () => {
    globalTimerState.activeTimer = null
    globalTimerState.timerCountdown = 0
    globalTimerState.timerStartTime = null
    globalTimerState.showModal = false
    notifyListeners()

    localStorage.removeItem('timerState')
  }

  const closeModal = () => {
    globalTimerState.showModal = false
    globalTimerState.activeTimer = null
    globalTimerState.timerCountdown = 0
    globalTimerState.timerStartTime = null
    notifyListeners()

    localStorage.removeItem('timerState')
  }

  const completeModal = () => {
    globalTimerState.showModal = false

    if (globalTimerState.activeTimer) {
      const now = Date.now()
      globalTimerState.timerStartTime = now
      globalTimerState.timerCountdown =
        globalTimerState.activeTimer.interval_minutes * 60
      saveTimerState(
        globalTimerState.activeTimer,
        globalTimerState.activeTimer.interval_minutes * 60,
        false
      )
    }

    notifyListeners()
  }

  return {
    activeTimer: state.activeTimer,
    timerCountdown: state.timerCountdown,
    showModal: state.showModal,
    modalTimeLeft: state.modalTimeLeft,
    startTimer,
    stopTimer,
    closeModal,
    completeModal,
  }
}

// Helper functions
function loadTimerState() {
  try {
    const savedState = localStorage.getItem('timerState')
    if (savedState) {
      const {
        reminderId,
        startTime,
        intervalMinutes,
        showModal: wasShowingModal,
      } = JSON.parse(savedState)
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const totalSeconds = intervalMinutes * 60
      const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

      if (remainingSeconds > 0) {
        globalTimerState.activeTimer = {
          id: reminderId,
          interval_minutes: intervalMinutes,
        }
        globalTimerState.timerCountdown = remainingSeconds
        globalTimerState.timerStartTime = startTime
        notifyListeners()

        if (wasShowingModal && remainingSeconds === 0) {
          globalTimerState.showModal = true
          globalTimerState.modalTimeLeft = 20
          notifyListeners()
        }
      } else if (wasShowingModal) {
        globalTimerState.showModal = true
        globalTimerState.modalTimeLeft = 20
        notifyListeners()
      }
    }
  } catch (err) {
    console.log('Error loading timer state:', err)
  }
}

function saveTimerState(timer, countdown, isShowingModal) {
  try {
    if (timer && countdown > 0) {
      localStorage.setItem(
        'timerState',
        JSON.stringify({
          reminderId: timer.id,
          startTime: globalTimerState.timerStartTime || Date.now(),
          intervalMinutes: timer.interval_minutes,
          showModal: isShowingModal,
        })
      )
    } else {
      localStorage.removeItem('timerState')
    }
  } catch (err) {
    console.log('Error saving timer state:', err)
  }
}
