
import React, { useState, useEffect, useRef } from 'react';
import { BudgetProfile, SUPPORTED_CURRENCIES } from '../types';
import { getLocationSuggestions } from '../services/travelService';

interface InputFormProps {
  onSubmit: (city: string, depDate: string, retDate: string, budgetAmt: number, budgetProf: BudgetProfile, currency: string) => void;
  isLoading: boolean;
  initialCurrency?: string;
  coords?: { latitude: number, longitude: number };
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialCurrency, coords }) => {
  const [city, setCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number>(2500);
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>('Mid-Range');
  const [currency, setCurrency] = useState(initialCurrency || 'USD');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialCurrency) setCurrency(initialCurrency);
  }, [initialCurrency]);

  const handleCityChange = (val: string) => {
    setCity(val);
    setShowSuggestions(true);
    
    if (suggestionTimeoutRef.current) window.clearTimeout(suggestionTimeoutRef.current);
    
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }

    suggestionTimeoutRef.current = window.setTimeout(async () => {
      setIsSuggesting(true);
      const items = await getLocationSuggestions(val, coords?.latitude, coords?.longitude);
      setSuggestions(items);
      setIsSuggesting(false);
    }, 600);
  };

  const selectSuggestion = (s: string) => {
    setCity(s);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && departureDate && returnDate) {
      onSubmit(city, departureDate, returnDate, budgetAmount, budgetProfile, currency);
    }
  };

  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6 relative">
      <div className="bg-white rounded-[2rem] p-4 sm:p-8 card-shadow border border-slate-50 space-y-6 relative z-[50]">
        
        {/* Main Location Input */}
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <i className="fas fa-map-location-dot text-lg"></i>
          </div>
          <input
            type="text"
            required
            autoComplete="off"
            placeholder="Where would you like to explore?"
            className="w-full bg-slate-50 border-none pl-16 pr-6 py-6 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 sm:text-lg"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            onFocus={() => city.length >= 3 && setShowSuggestions(true)}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || isSuggesting) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200">
              {isSuggesting && (
                <div className="p-6 flex items-center justify-center space-x-3">
                   <i className="fas fa-circle-notch fa-spin text-blue-500 text-xs"></i>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consulting Maps...</span>
                </div>
              )}
              {!isSuggesting && suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-8 py-5 hover:bg-slate-900 hover:text-white transition-colors flex items-center space-x-4 border-b border-slate-50 last:border-none"
                >
                  <i className="fas fa-location-dot text-xs opacity-30"></i>
                  <span className="text-sm font-bold tracking-tight">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Budget & Currency */}
          <div className="md:col-span-5 flex space-x-2">
            <div className="relative w-1/3">
              <select
                className="w-full bg-slate-50 border-none px-4 py-4 rounded-xl font-black text-xs uppercase text-slate-500 focus:ring-2 focus:ring-blue-500/10 outline-none appearance-none"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-slate-300">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
            <div className="relative flex-grow">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs">{currentCurrency?.symbol}</span>
              <input
                type="number"
                required
                className="w-full bg-slate-50 border-none pl-10 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none font-bold text-slate-800 text-sm"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
              />
            </div>
            <select
              className="bg-slate-50 border-none px-4 py-4 rounded-xl font-black text-xs uppercase text-slate-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
              value={budgetProfile}
              onChange={(e) => setBudgetProfile(e.target.value as BudgetProfile)}
            >
              <option value="Budget">Econ</option>
              <option value="Mid-Range">Mid</option>
              <option value="Luxury">Luxe</option>
            </select>
          </div>

          {/* Departure */}
          <div className="md:col-span-3 relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] font-black uppercase tracking-widest">Out</span>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border-none pl-14 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none font-bold text-slate-800 text-xs"
              value={departureDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          {/* Return */}
          <div className="md:col-span-4 relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] font-black uppercase tracking-widest">Return</span>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border-none pl-16 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none font-bold text-slate-800 text-xs"
              value={returnDate}
              min={departureDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto sm:min-w-[300px] bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 text-white font-black text-sm uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center space-x-3"
        >
          {isLoading ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Architecting Package...</span>
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic-sparkles"></i>
              <span>Synthesize Trip</span>
            </>
          )}
        </button>
        <div className="flex items-center space-x-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
           <span className="flex items-center space-x-1">
             <i className="fas fa-earth-americas text-blue-400"></i>
             <span>Global Ready</span>
           </span>
           <span className="w-1 h-1 rounded-full bg-slate-200"></span>
           <span className="flex items-center space-x-1">
             <i className="fas fa-money-bill-transfer text-emerald-400"></i>
             <span>{currency} Settlement</span>
           </span>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
