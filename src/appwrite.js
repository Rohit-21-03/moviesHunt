// appwrite.js
import { Client, Databases, ID, Query } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        title: movie.title, // <-- store the movie title
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : "",
      });
    }
  } catch (error) {
    console.log("updateSearchCount error:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(6), // <-- limit to latest 6
      Query.orderDesc("count"),
    ]);
    return result.documents || [];
  } catch (error) {
    console.log("getTrendingMovies error:", error);
    return [];
  }
};

export const getRandomMoviesByMood = async () => {
  const moods = [
    { name: "Action", id: 28 },
    { name: "Comedy", id: 35 },
    { name: "Drama", id: 18 },
    { name: "Thriller", id: 53 },
    { name: "Romance", id: 10749 },
  ];

  const moodResults = await Promise.all(
    moods.map(async (mood) => {
      const randomPage = Math.floor(Math.random() * 3) + 1;
      try {
        const res = await fetch(
          `/api/tmdb?url=/3/discover/movie&with_genres=${mood.id}&page=${randomPage}`
        );
        const { results } = await res.json();
        if (!results || results.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * results.length);
        const selected = results[randomIndex];
        return {
          id: selected.id,
          title: selected.title,
          poster_url: selected.poster_path
            ? `https://image.tmdb.org/t/p/w500/${selected.poster_path}`
            : "",
          mood: mood.name,
        };
      } catch {
        return null;
      }
    })
  );
  return moodResults.filter(Boolean);
};
