
// Sistema de notificações sonoras para sinais de trading

// Cria contexto de áudio apenas quando necessário para evitar problemas de política de autoplay
let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;

// Inicializa contexto de áudio com interação do usuário
export const initAudio = (): void => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainNode = audioContext.createGain();
      masterGainNode.connect(audioContext.destination);
      
      // Defina o volume mestre com base nas configurações salvas
      const settings = getSoundSettings();
      if (masterGainNode) {
        masterGainNode.gain.value = settings.volume;
      }
    } catch (error) {
      console.error("Web Audio API não é suportada neste navegador", error);
    }
  }
};

// Reproduz um som de alerta com parâmetros específicos
export const playAlertSound = (type: 'call' | 'put' | 'entry' | 'notification'): void => {
  const settings = getSoundSettings();
  
  // Verifica se os sons estão habilitados nas configurações
  if (!settings.enabled) return;
  
  // Verifica por tipo específico de alerta
  if (type === 'call' || type === 'put') {
    if (!settings.signalAlerts) return;
  } else if (type === 'entry') {
    if (!settings.entryAlerts) return;
  } else if (type === 'notification') {
    if (!settings.notificationAlerts) return;
  }
  
  if (!audioContext) {
    initAudio();
  }
  
  if (!audioContext || !masterGainNode) return; // Sai se o contexto de áudio ainda não pôde ser inicializado
  
  // Configura oscilador baseado no tipo de alerta
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  switch (type) {
    case 'call':
      // Tom mais alto para sinais de compra
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      playPattern(oscillator, gainNode, [0.15, 0.15, 0.3]);
      break;
      
    case 'put':
      // Tom mais baixo para sinais de venda
      oscillator.frequency.value = 400;
      gainNode.gain.value = 0.3;
      playPattern(oscillator, gainNode, [0.15, 0.15, 0.3]);
      break;
      
    case 'entry':
      // Som urgente para tempo de entrada
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.4;
      playPattern(oscillator, gainNode, [0.1, 0.1, 0.1, 0.1, 0.3]);
      break;
      
    case 'notification':
      // Som simples de notificação
      oscillator.frequency.value = 523.25; // C5
      gainNode.gain.value = 0.2;
      playPattern(oscillator, gainNode, [0.2]);
      break;
  }
};

// Auxiliar para tocar padrões de som
const playPattern = (oscillator: OscillatorNode, gainNode: GainNode, pattern: number[]): void => {
  if (!audioContext || !masterGainNode) return;
  
  oscillator.connect(gainNode);
  gainNode.connect(masterGainNode); // Conecte ao nó de ganho mestre para controle de volume
  
  oscillator.start();
  
  let time = audioContext.currentTime;
  
  // Toca o padrão
  pattern.forEach((duration, index) => {
    if (index % 2 === 0) {
      // Nota ligada
      gainNode.gain.setValueAtTime(gainNode.gain.value, time);
    } else {
      // Nota desligada
      gainNode.gain.setValueAtTime(0, time);
    }
    time += duration;
  });
  
  // Nota final desligada
  gainNode.gain.setValueAtTime(0, time);
  
  // Para o oscilador após o padrão ser completado
  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
    gainNode.disconnect();
  }, (time - audioContext.currentTime) * 1000 + 50);
};

// Configurações de som
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
    console.error('Erro ao recuperar configurações de som', error);
    return getDefaultSoundSettings();
  }
};

export const saveSoundSettings = (settings: SoundSettings): void => {
  localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
  
  // Aplica a mudança de volume ao nó de ganho mestre se existir
  if (masterGainNode) {
    masterGainNode.gain.value = settings.volume;
  }
};
