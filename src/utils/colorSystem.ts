
// Sistema de cores unificado para toda a aplicação
// Usado principalmente para indicadores de direção (CALL/PUT/NEUTRAL)

export type Direction = 'CALL' | 'PUT' | 'NEUTRAL';

export const DirectionColors = {
  // Cores principais para direções
  CALL: {
    bg: 'bg-green-500',
    hoverBg: 'hover:bg-green-600',
    text: 'text-green-600',
    darkText: 'dark:text-green-400',
    border: 'border-green-500',
    bgLight: 'bg-green-100',
    darkBgLight: 'dark:bg-green-900/20',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
  },
  PUT: {
    bg: 'bg-red-500',
    hoverBg: 'hover:bg-red-600',
    text: 'text-red-600',
    darkText: 'dark:text-red-400',
    border: 'border-red-500',
    bgLight: 'bg-red-100',
    darkBgLight: 'dark:bg-red-900/20',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
  },
  NEUTRAL: {
    bg: 'bg-amber-500',
    hoverBg: 'hover:bg-amber-600',
    text: 'text-amber-600',
    darkText: 'dark:text-amber-400',
    border: 'border-amber-500',
    bgLight: 'bg-amber-100',
    darkBgLight: 'dark:bg-amber-900/20',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600',
  }
};

// Cores para níveis de confiança
export const ConfidenceLevelColors = {
  HIGH: {
    text: 'text-green-600',
    darkText: 'dark:text-green-400',
  },
  MEDIUM: {
    text: 'text-amber-600', 
    darkText: 'dark:text-amber-400',
  },
  LOW: {
    text: 'text-gray-600',
    darkText: 'dark:text-gray-400',
  }
};

// Função para obter cores baseadas no nível de confiança (porcentagem)
export function getConfidenceLevelColors(confidence: number) {
  if (confidence > 70) {
    return ConfidenceLevelColors.HIGH;
  } else if (confidence > 40) {
    return ConfidenceLevelColors.MEDIUM;
  } else {
    return ConfidenceLevelColors.LOW;
  }
}
