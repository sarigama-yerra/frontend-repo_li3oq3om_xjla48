import { useEffect, useState, useMemo } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-3xl w-full mx-auto">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full bg-white/90 backdrop-blur border border-blue-200 px-6 py-3 pl-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800"
        placeholder="Search movies..."
      />
      <svg className="w-5 h-5 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path></svg>
    </div>
  )
}

function MovieCard({ movie }) {
  const poster = movie.poster || 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop'
  return (
    <a href={movie.link} target="_blank" rel="noreferrer" className="group">
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-blue-900/20 border border-white/10">
        <img src={poster} alt={movie.title} className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/20 to-transparent opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg drop-shadow-sm">
            {movie.title}
          </h3>
          {movie.year && <p className="text-blue-200 text-sm">{movie.year}</p>}
        </div>
      </div>
    </a>
  )
}

function Section({ title, movies }) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent ml-6" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {movies.map((m, idx) => (
          <MovieCard key={`${m.title}-${idx}`} movie={m} />
        ))}
      </div>
    </section>
  )
}

function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-white" />
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 tracking-tight">
          BlueWave Movies
        </h1>
        <p className="mt-4 text-blue-700 text-lg max-w-2xl mx-auto">
          Explore the most beloved films of all time. Beautiful UI, smooth interactions, and a curated list.
        </p>
      </div>
    </header>
  )
}

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${BACKEND_URL}/api/movies`)
        if (!res.ok) throw new Error('Failed to load movies')
        const data = await res.json()
        setMovies(data.results || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return movies
    return movies.filter(m =>
      (m.title || '').toLowerCase().includes(q) ||
      (m.year || '').toLowerCase().includes(q)
    )
  }, [movies, query])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6">
        <SearchBar value={query} onChange={setQuery} />

        {loading && (
          <div className="mt-16 text-center text-blue-700">Loading movies...</div>
        )}
        {error && (
          <div className="mt-6 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && (
          <>
            <Section title="Trending Now" movies={filtered.slice(0, 18)} />
            <Section title="Critics' Picks" movies={filtered.slice(18, 36)} />
            <Section title="Classics" movies={filtered.slice(36, 60)} />
          </>
        )}

        <footer className="py-14 text-center text-blue-600/80">
          Data source: Letterboxd Top 250 list by Jack. Posters and links belong to their respective owners.
        </footer>
      </div>
    </div>
  )
}

export default App
