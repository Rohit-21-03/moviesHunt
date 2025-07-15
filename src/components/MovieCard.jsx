import React from 'react';

const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    tagline,
    overview
  }
}) => {
  return (
    <div className="movie-card bg-white/10 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer">
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w300${poster_path}` : '/no-movie.png'}
        alt={title}
        className="w-full aspect-[2/3] object-cover rounded-t-xl"
      />

      <div className="p-4">
        <h3 className="text-white text-lg font-semibold truncate" title={title}>
          {title}
        </h3>

        {tagline && (
          <p className="text-white/70 text-sm italic mt-1 truncate" title={tagline}>
            {tagline}
          </p>
        )}

        <div className="flex items-center mt-3 text-white text-sm space-x-2">
          <div className="flex items-center space-x-1">
            <img src="/star.svg" alt="star" className="w-4 h-4" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>

          <p className="language capitalize">{original_language || 'N/A'}</p>

          <span>•</span>

          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>

        {overview && (
          <p className="text-white/60 text-xs mt-2 line-clamp-3" title={overview}>
            {overview}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
