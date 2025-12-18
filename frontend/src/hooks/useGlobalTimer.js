/**
 * Global timer hook that persists across page navigation
 */
import { useState, useEffect } from 'react'

// Sound utility function
function playStopStopAlert() {
  console.log('[SOUND] Playing STOP STOP alert...')

  try {
    // Create audio context
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)()

    // Resume context if suspended (required by browsers after user gesture)
    if (audioContext.state === 'suspended') {
      console.log('[SOUND] Audio context suspended, attempting to resume...')
      audioContext.resume().then(() => {
        console.log('[SOUND] Audio context resumed')
        playBeeps(audioContext)
      })
    } else {
      playBeeps(audioContext)
    }
  } catch (err) {
    console.error('[SOUND] Failed to create audio context:', err)
  }

  function playBeeps(audioContext) {
    const playBeep = (frequency, duration, delay = 0) => {
      try {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.frequency.value = frequency
        osc.type = 'sine'

        const now = audioContext.currentTime
        gain.gain.setValueAtTime(0.5, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

        osc.start(now + delay)
        osc.stop(now + delay + duration)

        console.log(`[SOUND] Beep: ${frequency}Hz for ${duration}s`)
      } catch (e) {
        console.error('[SOUND] Beep error:', e)
      }
    }

    const now = audioContext.currentTime
    playBeep(1000, 0.4, now) // First STOP - louder, higher frequency
    playBeep(1000, 0.4, now + 0.5) // Second STOP
    console.log('[SOUND] STOP STOP beeps queued')
  }
}

let globalTimerState = {
  activeTimer: null,
  timerCountdown: 0,
  timerStartTime: null,
  showModal: false,
  modalTimeLeft: 20,
}

let listeners = []
let soundInterval = null // Track repeating sound interval

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

        // Start repeating "STOP STOP" sound if enabled
        if (globalTimerState.activeTimer.notification_sound) {
          console.log('[TIMER] Sound enabled, starting repeating alert...')

          // Play immediately
          try {
            playStopStopAlert()
          } catch (e) {
            console.error('[TIMER] Sound play error:', e)
          }

          // Then repeat every 3 seconds until modal is closed
          if (soundInterval) clearInterval(soundInterval)
          soundInterval = setInterval(() => {
            console.log('[TIMER] Playing repeat sound...')
            try {
              playStopStopAlert()
            } catch (e) {
              console.error('[TIMER] Repeat sound error:', e)
            }
          }, 3000)
        }

        // Browser notification if enabled (works even when app is not in focus)
        if (
          globalTimerState.activeTimer.use_browser_notification &&
          'Notification' in window
        ) {
          // Request permission if not granted
          if (Notification.permission === 'granted') {
            const notification = new Notification(
              '🎯 STOP! Time for 20-20-20!',
              {
                body: 'Look away now! Find something 20 feet away for 20 seconds.',
                icon: '👀',
                tag: 'eyecare-20-20-20',
                requireInteraction: true, // Keep notification visible until user interacts
                badge: '👀',
              }
            )

            // Play sound again through notification click to ensure it's heard
            notification.onclick = () => {
              window.focus()
              notification.close()
            }
          } else if (Notification.permission !== 'denied') {
            // Auto-request permission if not yet decided
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                const notification = new Notification(
                  '🎯 STOP! Time for 20-20-20!',
                  {
                    body: 'Look away now! Find something 20 feet away for 20 seconds.',
                    icon: '👀',
                    tag: 'eyecare-20-20-20',
                    requireInteraction: true,
                    badge: '👀',
                  }
                )
                notification.onclick = () => {
                  window.focus()
                  notification.close()
                }
              }
            })
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

    console.log('[TIMER] Modal countdown started')

    const interval = setInterval(() => {
      console.log(`[TIMER] Modal time left: ${globalTimerState.modalTimeLeft}s`)
      globalTimerState.modalTimeLeft -= 1
      notifyListeners()

      if (globalTimerState.modalTimeLeft <= 0) {
        // Modal time finished - auto close and restart timer
        console.log('[TIMER] Modal countdown finished, auto-closing')
        clearInterval(interval)
        globalTimerState.showModal = false

        // Stop repeating sound
        if (soundInterval) {
          console.log('[TIMER] Auto-close: stopping sound')
          clearInterval(soundInterval)
          soundInterval = null
        }

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

    return () => {
      console.log('[TIMER] Modal countdown effect cleanup')
      clearInterval(interval)
    }
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
    // Stop repeating sound
    if (soundInterval) {
      console.log('[TIMER] Stop timer: stopping sound')
      clearInterval(soundInterval)
      soundInterval = null
    }

    globalTimerState.activeTimer = null
    globalTimerState.timerCountdown = 0
    globalTimerState.timerStartTime = null
    globalTimerState.showModal = false
    notifyListeners()

    localStorage.removeItem('timerState')
  }

  const closeModal = () => {
    // Stop repeating sound
    if (soundInterval) {
      console.log('[TIMER] Close modal: stopping sound')
      clearInterval(soundInterval)
      soundInterval = null
    }

    globalTimerState.showModal = false
    globalTimerState.activeTimer = null
    globalTimerState.timerCountdown = 0
    globalTimerState.timerStartTime = null
    notifyListeners()

    localStorage.removeItem('timerState')
  }

  const completeModal = () => {
    // Stop repeating sound
    if (soundInterval) {
      console.log('[TIMER] Complete modal: stopping sound')
      clearInterval(soundInterval)
      soundInterval = null
    }

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
