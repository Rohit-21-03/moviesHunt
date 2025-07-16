# Movie Discovery Web App

A modern, interactive web application to **discover movies and TV shows, browse trending titles, and watch official trailers**—all powered by [The Movie Database (TMDB)](https://www.themoviedb.org/) and YouTube APIs. Built for lightning-fast, responsive browsing and a cinematic experience inspired by real-world streaming platforms.

## ⭐ Features

- **Browse Latest Trailers**  
  Surf real-time movie trailers from multiple categories (Popular, Streaming, On TV, For Rent, In Theaters), with authentic YouTube thumbnails and an in-app video player.
- **Trending & Categories Toggle**  
  Instantly switch between categories or trending collections—animated sliding pill toggles just like leading streaming UIs.
- **Personalized Filtering**  
  Filter content by mood and runtime, discovering recommendations tailored to your current vibe.
- **Search & Recommendation System**  
  Fast, debounced search with Appwrite storing your recent searches; the app surfaces personalized trending picks based on your behavior.
- **Responsive & Polished UI**  
  Built with React, Tailwind CSS, and Vite for fast, smooth, and accessible browsing on all devices.
- **Authentication and Cloud Backend**  
  Uses Appwrite for storing per-user search history and integrating smart, privacy-first trending sections.

## 🛠 Tech Stack

| Area           | Technologies & Tools                  |
|----------------|--------------------------------------|
| Frontend       | React, Tailwind CSS, Vite, JavaScript (JSX/TS) |
| Backend/Cloud  | Appwrite (cloud backend/storage), TMDB API, YouTube Embed |
| Data/State     | REST APIs, React Hooks, Context, npm ecosystem |
| Utilities      | Git, VS Code, Postman                |

## 🚀 Getting Started

1. **Clone the repository**
    ```
    git clone https://github.com/Rohit-21-03/moviesHunt.git
    cd movie-discovery-app
    ```

2. **Install dependencies**
    ```
    npm install react react-dom react-router-dom axios appwrite tailwindcss postcss autoprefixer
    npm install -D vite eslint prettier @testing-library/react @testing-library/jest-dom
    npm install @reduxjs/toolkit react-redux
    npm install @heroicons/react clsx dotenv
    ```

3. **Configure Environment Variables**
    - Copy `.env.example` to `.env.local`.
    - Add your [TMDB API Key](https://developer.themoviedb.org/docs/getting-started) (get one for free!):
      ```
      VITE_TMDB_API_KEY=your_tmdb_api_key_here
      ```
    - Configure Appwrite instance if used.

4. **Run the app locally**
    ```
    npm run dev
    ```

5. **Go to**
    ```
    http://localhost:5173/
    https://movieshunt-delta.vercel.app/
    ```

   ⚠️ _If you're accessing the deployed site from **India**, and movies/trailers aren't loading, it's due to TMDB API blocks by certain Indian ISPs. Please use a VPN like [Cloudflare Warp](https://1.1.1.1/) to access the full functionality._
      
## 🧩 Main Components

- `LatestTrailers`: TMDB-style row of official YouTube trailers, with category toggle, smooth scroll, and instant playback.
- `Trending`: Shows trending and recommended films based on stored search history.
- `Preference`: Mood and runtime filter with animated toggle and styling.
- `MovieCard`: Consistent poster, rating, language/year, and responsive grid.
- `Appwrite`: Used to persist/search user data and enable personalized trending.

## 📝 Example Usage
