// Simple in-memory cache implementation
class Cache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  // Set a value in cache with optional TTL
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttl);
    
    console.log(`🗄️ CACHE SET: ${key} (TTL: ${ttl}ms)`);
  }

  // Get a value from cache
  get(key) {
    const expiry = this.ttl.get(key);
    
    // Check if key exists and hasn't expired
    if (this.cache.has(key) && expiry && Date.now() < expiry) {
      console.log(`🗄️ CACHE HIT: ${key}`);
      return this.cache.get(key);
    }
    
    // Remove expired key
    if (this.cache.has(key)) {
      console.log(`🗄️ CACHE EXPIRED: ${key}`);
      this.delete(key);
    }
    
    console.log(`🗄️ CACHE MISS: ${key}`);
    return null;
  }

  // Delete a key from cache
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
    console.log(`🗄️ CACHE DELETE: ${key}`);
  }

  // Clear all cache
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.ttl.clear();
    console.log(`🗄️ CACHE CLEAR: Removed ${size} entries`);
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: process.memoryUsage()
    };
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, expiry] of this.ttl.entries()) {
      if (now >= expiry) {
        this.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🗄️ CACHE CLEANUP: Removed ${cleaned} expired entries`);
    }
    
    return cleaned;
  }
}

// Create singleton instance
const cache = new Cache();

// Auto cleanup every 5 minutes
setInterval(() => {
  cache.cleanup();
}, 5 * 60 * 1000);

module.exports = cache;
