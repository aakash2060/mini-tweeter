import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres, savePreferences } from '../services/api';
import { Check, ArrowRight } from 'lucide-react';

export const GenreSelectionPage = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getGenres().then(res => setGenres(res.data));
  }, []);

  const toggle = (genre: string) => {
    setSelected(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) return setError('Pick at least one genre to continue');
    try {
      await savePreferences(selected);
      navigate('/dashboard');
    } catch {
      setError('Failed to save preferences');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#09090b] px-4 py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-100">What are you into?</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Choose the genres you care about — we'll personalise your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/40">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {genres.map(genre => {
                const isSelected = selected.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggle(genre)}
                    className={`relative flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-300'
                        : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600">
                        <Check size={10} className="text-white" />
                      </span>
                    )}
                    {genre}
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                {selected.length} selected
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                disabled={selected.length === 0}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
