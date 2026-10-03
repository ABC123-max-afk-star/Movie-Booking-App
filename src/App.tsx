import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Booking from "./Booking";
import MovieDetails from "./MovieDetails";

export type Movie = {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  emoji: string;
  showTime: string;
};

export const movies: Movie[] = [
  {
    id: 1,
    title: "Pushpa 2",
    genre: "Action • Drama",
    duration: "3h 20m",
    rating: "4.7",
    emoji: "🔥",
    showTime: "7:30 PM",
  },
  {
    id: 2,
    title: "Kalki 2898 AD",
    genre: "Sci-Fi • Action",
    duration: "3h 00m",
    rating: "4.6",
    emoji: "🚀",
    showTime: "6:30 PM",
  },
  {
    id: 3,
    title: "Devara",
    genre: "Action • Thriller",
    duration: "2h 58m",
    rating: "4.4",
    emoji: "🌊",
    showTime: "8:00 PM",
  },
  {
    id: 4,
    title: "Salaar",
    genre: "Action • Thriller",
    duration: "2h 55m",
    rating: "4.5",
    emoji: "⚔️",
    showTime: "9:00 PM",
  },
];

function Home() {
  const navigate = useNavigate();

  const openMovieDetails = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">🎬 MovieBook</div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#movies">Movies</a>
          <a href="#features">Theatres</a>
          <a href="#features">Offers</a>
        </div>

        <div className="nav-actions">
          <button type="button">📍 Guntur</button>
          <button type="button">Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">

          <p>WELCOME TO MOVIEBOOK</p>

          <h1>
            Book Your Movie
            <br />
            Tickets Easily
          </h1>

          <p className="description">
            Discover the latest movies, choose your
            favourite seats and enjoy an amazing
            movie experience.
          </p>

          <div className="search">
            <input
              type="text"
              placeholder="Search for movies..."
            />

            <button type="button">
              🔍 Search
            </button>
          </div>

        </div>
      </section>

      {/* MOVIES */}
      <section className="movies-section" id="movies">

        <p className="section-label">
          DISCOVER
        </p>

        <div className="section-header">
          <h2>Now Showing</h2>

          <button type="button">
            View All →
          </button>
        </div>

        <div className="movie-grid">

          {movies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
            >

              {/* POSTER */}
              <div className="poster">

                <span className="emoji">
                  {movie.emoji}
                </span>

                <h3>{movie.title}</h3>

                <span className="rating">
                  ⭐ {movie.rating}
                </span>

              </div>

              {/* MOVIE INFORMATION */}
              <div className="movie-info">

                <h3>{movie.title}</h3>

                <p>{movie.genre}</p>

                <div className="movie-bottom">

                  <span>
                    ⏱ {movie.duration}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      openMovieDetails(movie)
                    }
                  >
                    Book Now
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* FEATURES */}
      <section
        className="features"
        id="features"
      >

        <div>
          <div>🎟️</div>

          <h3>Easy Booking</h3>

          <p>
            Book movie tickets quickly
            and easily.
          </p>
        </div>

        <div>
          <div>💺</div>

          <h3>Choose Your Seat</h3>

          <p>
            Select your favourite seat
            before booking.
          </p>
        </div>

        <div>
          <div>🔒</div>

          <h3>Secure Booking</h3>

          <p>
            Your booking information
            is kept secure.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <h3>🎬 MovieBook</h3>

        <p>
          Your simple movie ticket
          booking platform.
        </p>

        <p>
          © 2026 MovieBook. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* MOVIE DETAILS */}
        <Route
          path="/movie/:movieId"
          element={
            <MovieDetails movies={movies} />
          }
        />

        {/* SEAT BOOKING */}
        <Route
          path="/booking/:movieId"
          element={
            <Booking movies={movies} />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;