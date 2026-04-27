import { motion } from 'motion/react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Country } from '../types';

interface CountryCardProps {
  country: Country;
  isSelected: boolean;
  onSelect: (country: Country) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}

export default function CountryCard({ country, isSelected, onSelect, onRemove, disabled }: CountryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full transition-shadow hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-4xl" role="img" aria-label={`Flag of ${country.name}`}>
            {country.flag}
          </span>
          <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-full uppercase tracking-wider">
            {country.region}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-1">{country.name}</h3>
        <p className="text-sm text-slate-500 mb-4 flex items-center">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
          {country.capital}
        </p>
      </div>

      <div className="mt-4">
        {isSelected ? (
          <button
            onClick={() => onRemove(country.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium transition-colors hover:bg-red-100"
          >
            <Trash2 size={18} />
            <span>Remove</span>
          </button>
        ) : (
          <button
            onClick={() => onSelect(country)}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              disabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
            }`}
          >
            {disabled ? <Check size={18} /> : <Plus size={18} />}
            <span>{disabled ? 'Limit Reached' : 'Add to Compare'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
