import React, { useEffect, useRef, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Trending = ({ fetchForYouMovies }) => {
  const [activeTab, setActiveTab] = useState("day");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use a ref to persist the array of refs
  const tabRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const tabKeys = ["day", "week", "For You"];
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
          setMovies(data.results || []);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [activeTab, fetchForYouMovies]);

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
        <div className="flex justify-center py-10 text-white/80">Loading...</div>
      ) : (
        <div className="flex overflow-x-auto gap-6 pb-3 hide-scrollbar">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-36 md:w-44 bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-lg hover:scale-105 transition-all"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px 0 rgba(80,80,180,0.12)",
              }}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
                className="w-full h-52 object-cover rounded-xl mb-2"
              />
              <span className="text-sm font-semibold text-center text-white block truncate">
                {movie.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Trending;
