
// Sistema de cache avançado para análises de mercado
// Reduz a carga computacional e melhora o desempenho com agrupamento, expiração e compressão

// Definição da estrutura de cache
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
  group?: string;
  priority?: number;
};

export class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxEntries: number = 1000;
  private hitCount: number = 0;
  private missCount: number = 0;
  private debugMode: boolean = false;
  
  constructor(maxEntries: number = 1000, debugMode: boolean = false) {
    this.maxEntries = maxEntries;
    this.debugMode = debugMode;
  }
  
  // Ativar/desativar modo de depuração
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }
  
  // Armazena dados no cache com tempo de expiração
  set<T>(key: string, data: T, ttlInSeconds: number = 60, options: { group?: string, priority?: number } = {}): void {
    if (this.cache.size >= this.maxEntries) {
      this.evictLeastUsed();
    }
    
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttlInSeconds * 1000),
      group: options.group,
      priority: options.priority || 1
    });
    
    if (this.debugMode) {
      console.log(`Cache: Set item with key ${key}, expires in ${ttlInSeconds}s`);
    }
  }
  
  // Recupera dados do cache se ainda válidos
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    const now = Date.now();
    
    if (!entry) {
      this.missCount++;
      if (this.debugMode) {
        console.log(`Cache MISS: ${key}`);
      }
      return null;
    }
    
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      this.missCount++;
      if (this.debugMode) {
        console.log(`Cache EXPIRED: ${key}`);
      }
      return null;
    }
    
    this.hitCount++;
    if (this.debugMode) {
      console.log(`Cache HIT: ${key}, age: ${Math.round((now - entry.timestamp) / 1000)}s`);
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
    if (this.cache.has(key)) {
      this.cache.delete(key);
      if (this.debugMode) {
        console.log(`Cache: Invalidated key ${key}`);
      }
    }
  }
  
  // Remove todas as entradas de um grupo
  invalidateGroup(group: string): void {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.group === group) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (this.debugMode) {
      console.log(`Cache: Invalidated ${count} entries from group ${group}`);
    }
  }
  
  // Remove todas as entradas expiradas
  cleanup(): void {
    const now = Date.now();
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (this.debugMode && count > 0) {
      console.log(`Cache: Cleaned up ${count} expired entries`);
    }
  }
  
  // Remove todas as entradas
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    
    if (this.debugMode) {
      console.log(`Cache: Cleared all ${count} entries`);
    }
  }
  
  // Gera uma chave de cache baseada em parâmetros
  generateKey(base: string, params: Record<string, any>): string {
    const sortedParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => {
        // Para objetos, usar JSON.stringify, para outros tipos usar direto
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        return `${key}:${valueStr}`;
      })
      .join('|');
    
    return `${base}|${sortedParams}`;
  }
  
  // Retorna estatísticas do cache
  getStats() {
    const now = Date.now();
    let expired = 0;
    
    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++;
      }
    }
    
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? (this.hitCount / total) * 100 : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxEntries,
      expired,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }
  
  // Remove a entrada menos usada quando o cache está cheio
  private evictLeastUsed(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    let lowestPriority = Infinity;
    
    // Primeiro tenta remover itens expirados
    this.cleanup();
    
    // Se ainda estiver cheio, remove o mais antigo com menor prioridade
    if (this.cache.size >= this.maxEntries) {
      for (const [key, entry] of this.cache.entries()) {
        const priority = entry.priority || 1;
        
        if (priority < lowestPriority || 
           (priority === lowestPriority && entry.timestamp < oldestTime)) {
          oldestKey = key;
          oldestTime = entry.timestamp;
          lowestPriority = priority;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
        if (this.debugMode) {
          console.log(`Cache: Evicted old entry with key ${oldestKey}`);
        }
      }
    }
  }
}

// Exporta uma instância singleton
export const cacheService = new CacheService(2000, false);

// Configurar limpeza automática do cache a cada 30 segundos
setInterval(() => {
  cacheService.cleanup();
}, 30 * 1000);
