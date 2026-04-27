import { motion } from 'motion/react';
import { X, Globe, Users, Maximize, MapPin } from 'lucide-react';
import { Country } from '../types';

interface CompareTableProps {
  countries: Country[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export default function CompareTable({ countries, onRemove, onClose }: CompareTableProps) {
  if (countries.length === 0) return null;

  const compareFields = [
    { label: 'Flag', key: 'flag', icon: Globe },
    { label: 'Capital', key: 'capital', icon: MapPin },
    { label: 'Population', key: 'population', icon: Users, format: (v: number) => v.toLocaleString() },
    { label: 'Area', key: 'area', icon: Maximize, format: (v: number) => `${v.toLocaleString()} km²` },
    { label: 'Region', key: 'region', icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Comparison Details
            <span className="text-xs font-normal text-slate-400">({countries.length} selected)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6">
          <div className="grid grid-cols-[120px_1fr_1fr] gap-4 md:gap-8">
            {/* Field Labels */}
            <div className="space-y-8 pt-16">
              {compareFields.map((field) => (
                <div key={field.label} className="h-12 flex items-center gap-2 text-slate-400">
                  <field.icon size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{field.label}</span>
                </div>
              ))}
            </div>

            {/* Country Columns */}
            {countries.map((country) => (
              <div key={country.id} className="text-center">
                <div className="h-16 flex flex-col items-center justify-center mb-8 relative group">
                  <button
                    onClick={() => onRemove(country.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                  <h3 className="text-lg font-bold text-slate-900 truncate w-full">{country.name}</h3>
                </div>

                <div className="space-y-8">
                  {compareFields.map((field) => {
                    const value = country[field.key as keyof Country];
                    return (
                      <div key={field.label} className="h-12 flex items-center justify-center">
                        {field.key === 'flag' ? (
                          <span className="text-5xl" role="img">{value as string}</span>
                        ) : (
                          <span className="text-sm font-medium text-slate-700">
                            {field.format ? field.format(value as number) : (value as string)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Empty column if only 1 country is selected (though UI opens at 2, user might remove one) */}
            {countries.length === 1 && (
              <div className="border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50/50">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-400">
                  <Globe size={24} />
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest text-center">
                  Select another country to compare
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
