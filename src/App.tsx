import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe2, Search, SlidersHorizontal, Info } from 'lucide-react';
import CountryCard from './components/CountryCard';
import CompareTable from './components/CompareTable';
import { COUNTRIES } from './constants';
import { Country } from './types';

export default function App() {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = useCallback((country: Country) => {
    setSelectedCountries((prev) => {
      if (prev.length >= 2) return prev;
      const newSelection = [...prev, country];
      if (newSelection.length === 2) {
        setIsCompareOpen(true);
      }
      return newSelection;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSelectedCountries((prev) => {
      const newSelection = prev.filter((c) => c.id !== id);
      if (newSelection.length === 0) {
        setIsCompareOpen(false);
      }
      return newSelection;
    });
  }, []);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.capital.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Globe2 size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">World Compare</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCompareOpen(!isCompareOpen)}
                disabled={selectedCountries.length === 0}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCountries.length > 0
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Compare
                {selectedCountries.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center border-2 border-white">
                    {selectedCountries.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search countries or capitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-white px-4 py-3 rounded-2xl border border-slate-200">
            <SlidersHorizontal size={16} />
            <span>Sort by: Population</span>
          </div>
        </div>

        {/* Info Banner */}
        {selectedCountries.length < 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700"
          >
            <Info size={18} />
            <p className="text-sm font-medium">
              {selectedCountries.length === 0
                ? "Select two countries to compare their statistics side-by-side."
                : "Select one more country to start the comparison."}
            </p>
          </motion.div>
        )}

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCountries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                isSelected={selectedCountries.some((c) => c.id === country.id)}
                onSelect={handleSelect}
                onRemove={handleRemove}
                disabled={selectedCountries.length >= 2 && !selectedCountries.some((c) => c.id === country.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredCountries.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No countries found</h3>
            <p className="text-slate-500 mt-1">Try a different search term.</p>
          </div>
        )}
      </main>

      {/* Compare Draw/Drawer */}
      <AnimatePresence>
        {isCompareOpen && (
          <CompareTable
            countries={selectedCountries}
            onRemove={handleRemove}
            onClose={() => setIsCompareOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Selection Summary Overlay (Mobile) */}
      {!isCompareOpen && selectedCountries.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-lg"
        >
          <div className="flex -space-x-2">
            {selectedCountries.map((c) => (
              <div key={c.id} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-lg">
                {c.flag}
              </div>
            ))}
          </div>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={() => setIsCompareOpen(true)}
            className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
          >
            Show Compare
          </button>
        </motion.div>
      )}
    </div>
  );
}
