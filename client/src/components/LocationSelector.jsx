import { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';

const BASE_URL = 'https://countriesnow.space/api/v0.1';

const LocationSelector = ({ value = {}, onChange, errors = {} }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loadingC, setLoadingC] = useState(false);
  const [loadingS, setLoadingS] = useState(false);
  const [loadingCi, setLoadingCi] = useState(false);

  const { country = '', state = '', city = '', zip_code = '' } = value;

  // ── 1. Load all countries on mount ──────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      setLoadingC(true);
      try {
        const res = await fetch(`${BASE_URL}/countries/positions`);
        const json = await res.json();
        if (json.data) setCountries(json.data.map(c => c.name).sort());
      } catch { /* silent */ }
      finally { setLoadingC(false); }
    };
    fetch_();
  }, []);

  // ── 2. Load states when country changes ─────────────────────────
  useEffect(() => {
    if (!country) { setStates([]); setCities([]); return; }
    const fetch_ = async () => {
      setLoadingS(true);
      setStates([]); setCities([]);
      try {
        const res = await fetch(`${BASE_URL}/countries/states`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country }),
        });
        const json = await res.json();
        if (json.data?.states) setStates(json.data.states.map(s => s.name).sort());
      } catch { /* silent */ }
      finally { setLoadingS(false); }
    };
    fetch_();
  }, [country]);

  // ── 3. Load cities when state changes ───────────────────────────
  useEffect(() => {
    if (!country || !state) { setCities([]); return; }
    const fetch_ = async () => {
      setLoadingCi(true);
      setCities([]);
      try {
        const res = await fetch(`${BASE_URL}/countries/state/cities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country, state }),
        });
        const json = await res.json();
        if (json.data) setCities(json.data.sort());
      } catch { /* silent */ }
      finally { setLoadingCi(false); }
    };
    fetch_();
  }, [country, state]);

  const set = (patch) => onChange({ ...value, ...patch });

  const cls = (field) => `
    w-full px-3 py-2 border rounded-lg text-sm
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    text-gray-900 dark:text-white transition-colors duration-200
    ${errors[field]
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e]'}
  `;

  // Spinner overlay helper
  const Spin = () => (
    <FiLoader className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                         animate-spin text-blue-500 pointer-events-none" />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Country */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Country *
        </label>
        <div className="relative">
          <select value={country} disabled={loadingC}
            onChange={e => set({ country: e.target.value, state: '', city: '', zip_code: '' })}
            className={cls('country')}
          >
            <option value="">
              {loadingC ? 'Loading...' : 'Select Country'}
            </option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {loadingC && <Spin />}
        </div>
        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
      </div>

      {/* State */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          State / Province *
        </label>
        <div className="relative">
          <select value={state}
            disabled={!country || loadingS}
            onChange={e => set({ state: e.target.value, city: '', zip_code: '' })}
            className={`${cls('state')} ${!country ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {!country ? 'Select country first'
               : loadingS ? 'Loading states...'
               : 'Select State'}
            </option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {loadingS && <Spin />}
        </div>
        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          City *
        </label>
        <div className="relative">
          <select value={city}
            disabled={!state || loadingCi}
            onChange={e => set({ city: e.target.value })}
            className={`${cls('city')} ${!state ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">
              {!state ? 'Select state first'
               : loadingCi ? 'Loading cities...'
               : 'Select City'}
            </option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {loadingCi && <Spin />}
        </div>
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>

      {/* ZIP — manual */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          ZIP / Postal Code (optional)
        </label>
        <input
          type="text"
          value={zip_code}
          onChange={e => set({ zip_code: e.target.value })}
          placeholder="e.g. 492001"
          className={cls('zip_code')}
        />
        {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>}
      </div>
    </div>
  );
};

export default LocationSelector;
