import { useNavigate, useParams } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  emoji: string;
  showTime: string;
};

type MovieDetailsProps = {
  movies: Movie[];
};

const theatres = [
  {
    name: "INOX Guntur",
    location: "Brodipet, Guntur",
    times: ["10:30 AM", "2:00 PM", "7:30 PM"],
  },
  {
    name: "PVR Cinemas",
    location: "Lakshmipuram, Guntur",
    times: ["11:00 AM", "3:30 PM", "8:00 PM"],
  },
  {
    name: "Tulasi Theatre",
    location: "Kothuru, Thullur",
    times: ["12:00 PM", "4:30 PM", "9:00 PM"],
  },
];

function MovieDetails({ movies }: MovieDetailsProps) {
  const navigate = useNavigate();
  const { movieId } = useParams();

  const movie = movies.find(
    (item) => item.id === Number(movieId)
  );

  if (!movie) {
    return (
      <div className="booking-page">
        <h1>Movie Not Found</h1>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Movies
        </button>
      </div>
    );
  }

  // This sends BOTH theatre and time to Booking.tsx
  const handleShowTime = (
    theatreName: string,
    time: string
  ) => {
    navigate(
      `/booking/${movie.id}?theatre=${encodeURIComponent(
        theatreName
      )}&time=${encodeURIComponent(time)}`
    );
  };

  return (
    <div className="movie-details-page">

      {/* BACK BUTTON */}
      <button
        className="details-back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Movies
      </button>

      <div className="movie-details-card">

        {/* POSTER */}
        <div className="details-poster">
          <span>{movie.emoji}</span>

          <h1>{movie.title}</h1>

          <div>
            ⭐ {movie.rating}
          </div>
        </div>

        {/* DETAILS */}
        <div className="movie-details-content">

          <p className="details-label">
            MOVIE DETAILS
          </p>

          <h1>{movie.title}</h1>

          <p className="details-genre">
            {movie.genre}
          </p>

          <p className="details-duration">
            ⏱ {movie.duration}
          </p>

          <p className="details-description">
            Enjoy an exciting movie experience with
            amazing action, drama and entertainment.
            Select your favourite theatre and show time
            below to continue booking.
          </p>

          {/* THEATRES */}
          <h2>Select Theatre</h2>

          <div className="theatre-list">

            {theatres.map((theatre) => (

              <div
                className="theatre-card"
                key={theatre.name}
              >

                {/* THEATRE INFORMATION */}
                <div className="theatre-info">

                  <h3>
                    {theatre.name}
                  </h3>

                  <p>
                    📍 {theatre.location}
                  </p>

                </div>

                {/* SHOW TIMES */}
                <div className="show-times">

                  {theatre.times.map((time) => (

                    <button
                      key={time}
                      onClick={() =>
                        handleShowTime(
                          theatre.name,
                          time
                        )
                      }
                    >
                      {time}
                    </button>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;