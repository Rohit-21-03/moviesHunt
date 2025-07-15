import React, { useEffect, useRef, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  }
};

const NUM_MOVIES = 10;

const CATEGORY_ENDPOINTS = {
  Popular: "/movie/popular",
  Streaming: "/discover/movie?with_watch_monetization_types=flatrate",
  "On TV": "/tv/on_the_air",
  "For Rent": "/discover/movie?with_watch_monetization_types=rent",
  "In Theaters": "/movie/now_playing"
};

const LatestTrailers = () => {
  const categories = Object.keys(CATEGORY_ENDPOINTS);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [trailers, setTrailers] = useState([]);
  const [playingId, setPlayingId] = useState(null);

  const tabRefs = useRef(categories.map(() => React.createRef()));
  const [sliderStyle, setSliderStyle] = useState({});

  useEffect(() => {
    const idx = categories.indexOf(activeCategory);
    const node = tabRefs.current[idx]?.current;
    if (node) {
      setSliderStyle({
        left: node.offsetLeft,
        width: node.offsetWidth,
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    setTrailers([]);
    setPlayingId(null);

    const fetchTrailers = async () => {
      const endpoint = CATEGORY_ENDPOINTS[activeCategory];
      const res = await fetch(`${API_BASE_URL}${endpoint}?language=en-US&page=1`, API_OPTIONS);
      const data = await res.json();
      const items = data.results?.slice(0, NUM_MOVIES) || [];

      const trailerData = await Promise.all(
        items.map(async (m) => {
          const isTV = Boolean(m.name && !m.title);
          const videoRes = await fetch(
            `${API_BASE_URL}/${isTV ? "tv" : "movie"}/${m.id}/videos?language=en-US`,
            API_OPTIONS
          );
          const videos = (await videoRes.json()).results || [];
          const ytv =
            videos.find(
              (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
            ) || videos.find((v) => v.site === "YouTube");
          if (!ytv) return null;
          return {
            id: m.id,
            title: m.title || m.name,
            tagline: m.tagline,
            trailerKey: ytv.key
          };
        })
      );
      setTrailers(trailerData.filter(Boolean));
    };
    fetchTrailers();
  }, [activeCategory]);

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-xl font-bold text-white">Latest Trailers</h3>
        <div className="relative flex backdrop-blur-md bg-white/20 rounded-full shadow-lg overflow-hidden transition-all min-w-[255px]">
          <span
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 z-0"
            style={{
              ...sliderStyle,
              position: "absolute",
              transition: "all 0.3s cubic-bezier(.4,2,.6,1)"
            }}
          />
          {categories.map((category, idx) => (
            <button
              key={category}
              ref={tabRefs.current[idx]}
              className={`relative px-5 py-2 font-semibold transition-all z-10 cursor-pointer ${
                activeCategory === category ? "text-white" : "text-white/80"
              }`}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div
        className="flex overflow-x-auto gap-6 pb-3 hide-scrollbar"
        style={{ height: 220, minHeight: 220, maxHeight: 220 }}
      >
        {trailers.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 cursor-pointer"
            style={{ width: 300, minWidth: 300 }}
            onClick={() => setPlayingId(t.id)}
          >
            {playingId === t.id ? (
              <div className="aspect-video rounded overflow-hidden shadow">
                <iframe
                  src={`https://www.youtube.com/embed/${t.trailerKey}?autoplay=1&controls=1`}
                  title={t.title}
                  width="100%"
                  height="100%"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ minHeight: 168.54 }}
                />
              </div>
            ) : (
              <div className="relative" style={{ width: 300, height: 168.54 }}>
                <img
                  src={`https://img.youtube.com/vi/${t.trailerKey}/hqdefault.jpg`}
                  alt={t.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg
                    className="w-14 h-14 text-white"
                    fill="currentColor"
                    viewBox="0 0 84 84"
                  >
                    <circle
                      cx="42"
                      cy="42"
                      r="42"
                      fill="currentColor"
                      opacity="0.6"
                    />
                    <polygon points="33,24 60,42 33,60" fill="black" />
                  </svg>
                </div>
              </div>
            )}
            <div
              className="text-white text-base font-bold text-center mt-2 truncate"
              style={{ width: 280 }}
            >
              {t.title}
            </div>
            {t.tagline && (
              <div
                className="text-white/70 text-xs italic text-center px-2 truncate"
                style={{ width: 280 }}
              >
                {t.tagline}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestTrailers;
