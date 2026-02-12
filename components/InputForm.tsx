
import React, { useState } from 'react';
import { BudgetProfile } from '../types';

interface InputFormProps {
  onSubmit: (city: string, days: number, budget: BudgetProfile) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<BudgetProfile>('Mid-Range');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSubmit(city, days, budget);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <i className="fas fa-map-marked-alt text-blue-600 mr-3"></i>
        Plan Your Next Adventure
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Where to?</label>
          <input
            type="text"
            required
            placeholder="Enter City (e.g. Kyoto, Paris, Goa)"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Days)</label>
            <input
              type="number"
              min="1"
              max="14"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Style</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetProfile)}
            >
              <option value="Budget">💰 Budget</option>
              <option value="Mid-Range">🏢 Mid-Range</option>
              <option value="Luxury">💎 Luxury</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <><i className="fas fa-circle-notch fa-spin"></i><span>Architecting Trip...</span></>
          ) : (
            <><i className="fas fa-bolt"></i><span>Generate Package</span></>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
