
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
  const [budgetAmount, setBudgetAmount] = useState<number>(2000);
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>('Mid-Range');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() && departureDate && returnDate) {
      onSubmit(city, departureDate, returnDate, budgetAmount, budgetProfile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] p-8 md:p-12 border border-slate-100 max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        
        {/* Destination */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Destination Spot</label>
          <div className="relative group">
            <input
              type="text"
              required
              placeholder="e.g. Kyoto, Japan"
              className="w-full bg-slate-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-slate-800 placeholder:text-slate-300"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Spending Limit</label>
          <div className="flex items-center space-x-3">
            <div className="relative flex-grow">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
              <input
                type="number"
                required
                min="100"
                className="w-full bg-slate-50 border-none pl-11 pr-6 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
              />
            </div>
            <select
              className="px-6 py-5 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              value={budgetProfile}
              onChange={(e) => setBudgetProfile(e.target.value as BudgetProfile)}
            >
              <option value="Budget">Econ</option>
              <option value="Mid-Range">Mid</option>
              <option value="Luxury">Luxe</option>
            </select>
          </div>
        </div>

        {/* Departure */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Departure</label>
          <input
            type="date"
            required
            className="w-full bg-slate-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
            value={departureDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* Return */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Return</label>
          <input
            type="date"
            required
            className="w-full bg-slate-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
            value={returnDate}
            min={departureDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4 flex flex-col items-center space-y-6">
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full md:w-auto md:px-20 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black text-sm uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl hover:shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center space-x-3"
        >
          {isLoading ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Building...</span>
            </>
          ) : (
            <>
              <i className="fas fa-sparkles transition-transform group-hover:rotate-12"></i>
              <span>Architect Trip</span>
            </>
          )}
        </button>
        <div className="flex items-center space-x-2 text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.2em]">
          <i className="fas fa-lock text-[7px]"></i>
          <span>Verified Google Search Grounding &middot; AI Driven</span>
        </div>
      </div>
    </form>
  );
};

export default InputForm;
