import { useState, useEffect } from 'react';
import { CacheManager } from '../api/api';

export default function CacheStatus() {
  const [cacheSize, setCacheSize] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const updateCacheSize = () => {
      try {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(k => k.startsWith('api_cache_'));
        setCacheSize(cacheKeys.length);
      } catch (e) {
        setCacheSize(0);
      }
    };

    updateCacheSize();
    const interval = setInterval(updateCacheSize, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    CacheManager.clear();
    setCacheSize(0);
    window.location.reload();
  };

  if (!show && cacheSize === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all text-sm"
          title="Cache Status"
        >
          📦 {cacheSize}
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-4 border border-slate-200 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">Cache Status</h3>
            <button onClick={() => setShow(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <div className="text-sm text-slate-600 mb-3">
            <div>📦 Cached Items: {cacheSize}</div>
            <div className="text-xs text-slate-400 mt-1">5 min TTL</div>
          </div>
          <button
            onClick={handleClearCache}
            className="w-full bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
          >
            Clear Cache
          </button>
        </div>
      )}
    </div>
  );
}
