import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres, savePreferences } from '../services/api';

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
    if (selected.length === 0) return setError('Please select at least one genre');
    try {
      await savePreferences(selected);
      navigate('/dashboard');
    } catch {
      setError('Failed to save preferences');
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>What are you interested in?</h2>
        <p>Select genres to personalise your dashboard recommendations.</p>
        <form onSubmit={handleSubmit}>
          <div className="genre-grid">
            {genres.map(genre => (
              <label key={genre} className={`genre-chip ${selected.includes(genre) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(genre)}
                  onChange={() => toggle(genre)}
                />
                {genre}
              </label>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">Save & Continue</button>
        </form>
      </div>
    </div>
  );
};
