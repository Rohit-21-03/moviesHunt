import React, { useEffect, useRef, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Trending = ({ fetchForYouMovies, forYouRefreshKey }) => {
  const [activeTab, setActiveTab] = useState("day");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const tabKeys = ["day", "week", "foryou"];
  const [sliderStyle, setSliderStyle] = useState({});

  useEffect(() => {
    const idx = tabKeys.indexOf(activeTab);
    const node = tabRefs.current[idx].current;
    if (node) {
      setSliderStyle({
        left: node.offsetLeft,
        width: node.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "foryou") {
          if (fetchForYouMovies) {
            const personalized = await fetchForYouMovies();
            setMovies(personalized || []);
          } else {
            setMovies([]);
          }
        } else {
          const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/${activeTab}`,
            API_OPTIONS
          );
          const data = await response.json();
          setMovies((data.results || []).slice(0, 6).map((movie) => ({
            ...movie,
            vote_average: movie.vote_average,
            original_language: movie.original_language,
            release_date: movie.release_date,
          })));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [activeTab, fetchForYouMovies, forYouRefreshKey]);

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-white drop-shadow">Trending Movies</h2>
        <div className="relative flex backdrop-blur-md bg-white/20 rounded-full shadow-lg overflow-hidden transition-all min-w-[255px]">
          <span
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 z-0"
            style={{
              ...sliderStyle,
              position: "absolute",
              transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
            }}
          />
          <button
            ref={tabRefs.current[0]}
            className={`relative px-5 py-2 font-semibold transition-all z-10 ${
              activeTab === "day" ? "text-white" : "text-white/80"
            } cursor-pointer`}
            onClick={() => setActiveTab("day")}
          >
            Today
          </button>
          <button
            ref={tabRefs.current[1]}
            className={`relative px-5 py-2 font-semibold transition-all z-10 ${
              activeTab === "week" ? "text-white" : "text-white/80"
            } cursor-pointer`}
            onClick={() => setActiveTab("week")}
          >
            This Week
          </button>
          <button
            ref={tabRefs.current[2]}
            className={`relative px-5 py-2 font-semibold transition-all z-10 ${
              activeTab === "foryou" ? "text-white" : "text-white/80"
            } cursor-pointer`}
            onClick={() => setActiveTab("foryou")}
          >
            For You
          </button>
        </div>
      </div>
      {isLoading ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, idx) => (
            <li
              key={idx}
              className="rounded-xl bg-gray-800 animate-pulse h-80"
            ></li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <li key={movie.id} className="rounded-xl bg-white/10 p-2 shadow-lg">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-52 object-cover rounded-xl mb-2"
              />
              <div className="p-2">
                <span className="font-semibold text-white block truncate">
                  {movie.title}
                </span>
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} ⭐
                  </span>
                  <span>
                    {movie.original_language
                      ? movie.original_language.toUpperCase()
                      : "N/A"}
                  </span>
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Trending;
