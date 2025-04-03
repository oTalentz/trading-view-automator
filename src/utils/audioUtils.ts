
// Sound notification system for trading signals

// Create audio context only when needed to avoid autoplay policy issues
let audioContext: AudioContext | null = null;

// Initialize audio context with user interaction
export const initAudio = (): void => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error("Web Audio API is not supported in this browser", error);
    }
  }
};

// Play a beep sound with specific parameters
export const playAlertSound = (type: 'call' | 'put' | 'entry' | 'notification'): void => {
  if (!audioContext) {
    initAudio();
  }
  
  if (!audioContext) return; // Exit if audio context still couldn't initialize
  
  // Configure oscillator based on alert type
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  switch (type) {
    case 'call':
      // Higher pitch for call (buy) signals
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      playPattern(oscillator, gainNode, [0.15, 0.15, 0.3]);
      break;
      
    case 'put':
      // Lower pitch for put (sell) signals
      oscillator.frequency.value = 400;
      gainNode.gain.value = 0.3;
      playPattern(oscillator, gainNode, [0.15, 0.15, 0.3]);
      break;
      
    case 'entry':
      // Urgent sound for entry time
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.4;
      playPattern(oscillator, gainNode, [0.1, 0.1, 0.1, 0.1, 0.3]);
      break;
      
    case 'notification':
      // Simple notification sound
      oscillator.frequency.value = 523.25; // C5
      gainNode.gain.value = 0.2;
      playPattern(oscillator, gainNode, [0.2]);
      break;
  }
};

// Helper to play sound patterns
const playPattern = (oscillator: OscillatorNode, gainNode: GainNode, pattern: number[]): void => {
  if (!audioContext) return;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  
  let time = audioContext.currentTime;
  
  // Play the pattern
  pattern.forEach((duration, index) => {
    if (index % 2 === 0) {
      // Note on
      gainNode.gain.setValueAtTime(gainNode.gain.value, time);
    } else {
      // Note off
      gainNode.gain.setValueAtTime(0, time);
    }
    time += duration;
  });
  
  // Final note off
  gainNode.gain.setValueAtTime(0, time);
  
  // Stop oscillator after pattern completes
  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
  }, (time - audioContext.currentTime) * 1000 + 50);
};

// Sound settings
export interface SoundSettings {
  enabled: boolean;
  signalAlerts: boolean;
  entryAlerts: boolean;
  notificationAlerts: boolean;
  volume: number;
}

const SOUND_SETTINGS_KEY = 'trading-automator-sound-settings';

export const getDefaultSoundSettings = (): SoundSettings => ({
  enabled: true,
  signalAlerts: true,
  entryAlerts: true,
  notificationAlerts: true,
  volume: 0.7
});

export const getSoundSettings = (): SoundSettings => {
  try {
    const settings = localStorage.getItem(SOUND_SETTINGS_KEY);
    return settings ? {...getDefaultSoundSettings(), ...JSON.parse(settings)} : getDefaultSoundSettings();
  } catch (error) {
    console.error('Error retrieving sound settings', error);
    return getDefaultSoundSettings();
  }
};

export const saveSoundSettings = (settings: SoundSettings): void => {
  localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
};
