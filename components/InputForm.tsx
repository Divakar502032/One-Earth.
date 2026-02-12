
import React, { useState } from 'react';
import { BudgetProfile } from '../types';

interface InputFormProps {
  onSubmit: (city: string, depDate: string, retDate: string, budgetAmt: number, budgetProf: BudgetProfile) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [city, setCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState<number>(2500);
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>('Mid-Range');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && departureDate && returnDate) {
      onSubmit(city, departureDate, returnDate, budgetAmount, budgetProfile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-[2rem] p-4 sm:p-8 card-shadow border border-slate-50 space-y-6">
        
        {/* Main Location Input */}
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <i className="fas fa-map-location-dot text-lg"></i>
          </div>
          <input
            type="text"
            required
            placeholder="Where would you like to explore?"
            className="w-full bg-slate-50 border-none pl-16 pr-6 py-6 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 sm:text-lg"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Budget */}
          <div className="md:col-span-1 flex space-x-2">
            <div className="relative flex-grow">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm">$</span>
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
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-black uppercase">Out</span>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border-none pl-14 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none font-bold text-slate-800 text-sm"
              value={departureDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          {/* Return */}
          <div className="relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-black uppercase">In</span>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border-none pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none font-bold text-slate-800 text-sm"
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
             <i className="fas fa-check-circle text-blue-400"></i>
             <span>Live Grounding</span>
           </span>
           <span className="w-1 h-1 rounded-full bg-slate-200"></span>
           <span className="flex items-center space-x-1">
             <i className="fas fa-bolt text-amber-400"></i>
             <span>One-Click Booking</span>
           </span>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
