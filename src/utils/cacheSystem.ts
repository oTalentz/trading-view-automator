
// Sistema de cache para análises de mercado
// Reduz a carga computacional e melhora o desempenho

// Definição da estrutura de cache
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  // Armazena dados no cache com tempo de expiração
  set<T>(key: string, data: T, ttlInSeconds: number = 60): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttlInSeconds * 1000)
    });
  }
  
  // Recupera dados do cache se ainda válidos
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    const now = Date.now();
    
    if (!entry) return null;
    if (now > entry.expiresAt) {
      this.cache.delete(key); // Remove entrada expirada
      return null;
    }
    
    return entry.data as T;
  }
  
  // Verifica se uma chave existe e está válida
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  // Remove uma entrada do cache
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  // Remove todas as entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
  
  // Remove todas as entradas
  clear(): void {
    this.cache.clear();
  }
  
  // Gera uma chave de cache baseada em parâmetros
  generateKey(base: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${base}|${sortedParams}`;
  }
}

// Exporta uma instância singleton
export const cacheService = new CacheService();

// Configurar limpeza automática do cache a cada minuto
setInterval(() => {
  cacheService.cleanup();
}, 60 * 1000);
