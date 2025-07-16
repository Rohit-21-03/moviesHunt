import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import {
  updateSearchCount,
  getTrendingMovies,
  getRandomMoviesByMood,
} from "./appwrite.js";
import Preference from "./components/Preference.jsx";
import Trending from "./components/Trending.jsx";
import LatestTrailer from "./components/LatestTrailer.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const moodGenreMap = {
  Happy: ["Comedy", "Animation"],
  Thrilling: ["Thriller", "Action"],
  Romantic: ["Romance", "Drama"],
  Chill: ["Comedy", "Family"],
  Adventurous: ["Adventure", "Fantasy", "Action"],
  Nostalgic: ["Drama", "Family"],
  Uplifting: ["Family", "Comedy"],
  Dark: ["Horror", "Thriller"],
  Inspiring: ["Drama", "History"],
  Suspenseful: ["Thriller", "Mystery"],
  Heartwarming: ["Family", "Romance"],
  Mysterious: ["Mystery", "Thriller"],
  "Action-packed": ["Action", "Adventure"],
  "Feel-Good": ["Comedy", "Romance"],
  Epic: ["Adventure", "Fantasy"],
  Lighthearted: ["Comedy", "Family"],
  Emotional: ["Drama", "Romance"],
  Intense: ["Thriller", "Action"],
  "Family-Friendly": ["Family", "Animation"],
  Quirky: ["Comedy", "Fantasy"],
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [availableTime, setAvailableTime] = useState(90);
  const [searchHistory, setSearchHistory] = useState([]);
  const [genres, setGenres] = useState([]);
  const [forYouRefreshKey, setForYouRefreshKey] = useState(0);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/genre/movie/list`,
          API_OPTIONS
        );
        const data = await response.json();
        setGenres(data.genres || []);
      } catch {
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  const getGenreIdByName = (name) => {
    const found = genres.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
    return found ? found.id : null;
  };

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    let endpoint = "";

    if (query) {
      endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}`;
    } else {
      const genresToSearch = (moodGenreMap[selectedMood] || [])
        .map(getGenreIdByName)
        .filter(Boolean);
      const genreQuery =
        genresToSearch.length > 0
          ? `&with_genres=${genresToSearch.join(",")}`
          : "";
      const runtimeQuery = `&with_runtime.lte=${availableTime}`;
      endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc${genreQuery}${runtimeQuery}`;
    }

    try {
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
        setSearchHistory((prev) => {
          const updated = [...prev, query];
          return updated.slice(-10);
        });
        setForYouRefreshKey((k) => k + 1);
      }
    } catch {
      setErrorMessage("Error fetching movies. Please try again later.");
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForYouMovies = async () => {
    const personalized = await getTrendingMovies();
    if (personalized?.length > 0) {
      return personalized
        .slice(0, 6)
        .map((movie) => ({
          id: movie.movie_id,
          title: movie.title,
          poster_path: movie.poster_url.replace(
            "https://image.tmdb.org/t/p/w500",
            ""
          ),
          vote_average: movie.vote_average,
          original_language: movie.original_language,
          release_date: movie.release_date,
        }));
    } else {
      const random = await getRandomMoviesByMood();
      return random
        .slice(0, 6)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_url.replace(
            "https://image.tmdb.org/t/p/w500",
            ""
          ),
          vote_average: movie.vote_average,
          original_language: movie.original_language,
          release_date: movie.release_date,
        }));
    }
  };

  const latestMovieId = movieList.length > 0 ? movieList[0].id : null;

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm && genres.length > 0) {
      fetchMovies("");
    }
  }, [selectedMood, availableTime, genres]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
        </header>
        <Trending
          fetchForYouMovies={fetchForYouMovies}
          forYouRefreshKey={forYouRefreshKey}
        />
        {latestMovieId && <LatestTrailer movieId={latestMovieId} />}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center justify-between mb-4 mt-10 px-2">
          <h2 className="text-2xl font-bold text-white drop-shadow">
            All Movies
          </h2>
          <Preference
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            availableTime={availableTime}
            setAvailableTime={setAvailableTime}
            genres={genres}
          />
        </div>
        <section className="all-movies">
          {isLoading ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <li
                  key={idx}
                  className="rounded-xl bg-gray-800 animate-pulse h-80"
                ></li>
              ))}
            </ul>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
