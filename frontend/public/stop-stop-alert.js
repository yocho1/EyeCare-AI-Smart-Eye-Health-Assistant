// Function to generate and play "STOP STOP" sound directly
// This avoids browser autoplay restrictions by being explicit
export function playStopStopAlert() {
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
    // Fallback: try HTML5 audio element
    playFallbackSound()
  }
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
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

      osc.start(now + delay)
      osc.stop(now + delay + duration)

      console.log(
        `[SOUND] Beep played: ${frequency}Hz for ${duration}s at ${delay}s delay`
      )
    } catch (e) {
      console.error('[SOUND] Error playing beep:', e)
    }
  }

  const now = audioContext.currentTime
  // Two loud beeps for "STOP STOP"
  playBeep(1000, 0.4, now) // First STOP - louder
  playBeep(1000, 0.4, now + 0.5) // Second STOP

  console.log('[SOUND] STOP STOP beeps queued')
}

function playFallbackSound() {
  console.log(
    '[SOUND] Using fallback: asking browser to play notification sound'
  )
  // Create a simple audio element and play a system beep
  try {
    const audio = new Audio(
      'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
    )
    audio.play().catch((e) => {
      console.log('[SOUND] Fallback audio failed:', e)
    })
  } catch (e) {
    console.error('[SOUND] Fallback failed:', e)
  }
}
