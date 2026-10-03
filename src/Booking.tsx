import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type Movie = {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  show_time: string;
};

type BookingProps = {
  movies: Movie[];
};

const TOTAL_SEATS = 40;
const PRICE_PER_TICKET = 150;

const bookedSeats = [3, 7, 12, 18, 25, 31, 36];

const API_URL = "http://127.0.0.1:5000";

function Booking({ movies }: BookingProps) {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const movie = movies.find(
    (item) => item.id === Number(movieId)
  );

  const theatre =
    searchParams.get("theatre") || "Theatre not selected";

  const time =
    searchParams.get("time") ||
    movie?.show_time ||
    "Time not selected";

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  if (!movie) {
    return (
      <div className="page">
        <div className="not-found">
          <h2>Movie not found</h2>

          <button onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const toggleSeat = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    setSelectedSeats((previousSeats) => {
      if (previousSeats.includes(seatNumber)) {
        return previousSeats.filter(
          (seat) => seat !== seatNumber
        );
      }

      return [...previousSeats, seatNumber];
    });
  };

  const totalAmount =
    selectedSeats.length * PRICE_PER_TICKET;

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    setIsBooking(true);

    try {
      console.log("Sending booking to backend...");

      const bookingData = {
        movie_id: movie.id,
        movie_title: movie.title,
        theatre: theatre,
        show_time: time,
        seats: selectedSeats,
        tickets: selectedSeats.length,
        total_amount: totalAmount,
      };

      console.log("Booking data:", bookingData);

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      console.log("Backend status:", response.status);

      // Read response as text first.
      // This prevents JSON parsing errors from being
      // incorrectly reported as connection errors.
      const responseText = await response.text();

      console.log("Backend response:", responseText);

      let data: any = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Backend did not return JSON:",
          responseText
        );
      }

      if (!response.ok) {
        alert(
          data.message ||
            `Booking failed. Server returned ${response.status}.`
        );
        return;
      }

      alert(
        `Booking Confirmed!\n\n` +
          `Booking ID: ${data.booking_id || data.id || "Created"}\n` +
          `Movie: ${movie.title}\n` +
          `Theatre: ${theatre}\n` +
          `Time: ${time}\n` +
          `Seats: ${selectedSeats.join(", ")}\n` +
          `Tickets: ${selectedSeats.length}\n` +
          `Total: ₹${totalAmount}`
      );

      setSelectedSeats([]);
    } catch (error) {
      console.error("BOOKING ERROR:", error);

      alert(
        "Cannot connect to booking server.\n\n" +
          "Check that this is running:\n" +
          "http://localhost:5000"
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="booking-page">

      {/* HEADER */}
      <div className="booking-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h1>Book Your Seats</h1>
      </div>

      {/* MOVIE INFORMATION */}
      <div className="booking-movie-info">

        <div className="booking-poster">
          {movie.title.includes("Pushpa")
            ? "🌺"
            : movie.title.includes("Kalki")
            ? "🚀"
            : movie.title.includes("Devara")
            ? "🌊"
            : "🔥"}
        </div>

        <div className="booking-details">

          <h2>{movie.title}</h2>

          <p>
            <strong>Genre:</strong>{" "}
            {movie.genre}
          </p>

          <p>
            <strong>Duration:</strong>{" "}
            {movie.duration}
          </p>

          <p>
            <strong>Rating:</strong>{" "}
            ⭐ {movie.rating}
          </p>

          <p>
            <strong>Theatre:</strong>{" "}
            {theatre}
          </p>

          <p>
            <strong>Show Time:</strong>{" "}
            {time}
          </p>

        </div>
      </div>

      {/* SCREEN */}
      <div className="screen-section">

        <div className="screen">
          SCREEN
        </div>

        <p className="screen-text">
          All eyes this way
        </p>

      </div>

      {/* SEATS */}
      <div className="seat-section">

        <h2>Select Your Seats</h2>

        <div className="seat-grid">

          {Array.from(
            { length: TOTAL_SEATS },
            (_, index) => index + 1
          ).map((seatNumber) => {

            const isBooked =
              bookedSeats.includes(seatNumber);

            const isSelected =
              selectedSeats.includes(seatNumber);

            return (
              <button
                key={seatNumber}
                className={`seat ${
                  isBooked
                    ? "booked"
                    : isSelected
                    ? "selected"
                    : "available"
                }`}
                disabled={isBooked}
                onClick={() =>
                  toggleSeat(seatNumber)
                }
              >
                {seatNumber}
              </button>
            );
          })}

        </div>

        {/* LEGEND */}
        <div className="seat-legend">

          <div className="legend-item">
            <span className="legend-box available"></span>
            Available
          </div>

          <div className="legend-item">
            <span className="legend-box selected"></span>
            Selected
          </div>

          <div className="legend-item">
            <span className="legend-box booked"></span>
            Booked
          </div>

        </div>

      </div>

      {/* BOOKING SUMMARY */}
      <div className="booking-summary">

        <h2>Booking Summary</h2>

        <div className="summary-row">
          <span>Movie</span>
          <strong>{movie.title}</strong>
        </div>

        <div className="summary-row">
          <span>Theatre</span>
          <strong>{theatre}</strong>
        </div>

        <div className="summary-row">
          <span>Show Time</span>
          <strong>{time}</strong>
        </div>

        <div className="summary-row">
          <span>Selected Seats</span>

          <strong>
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "None"}
          </strong>
        </div>

        <div className="summary-row">
          <span>Tickets</span>

          <strong>
            {selectedSeats.length}
          </strong>
        </div>

        <div className="summary-row">
          <span>Price per Ticket</span>

          <strong>
            ₹{PRICE_PER_TICKET}
          </strong>
        </div>

        <div className="summary-total">
          <span>Total Amount</span>

          <strong>
            ₹{totalAmount}
          </strong>
        </div>

        <button
          className="confirm-booking"
          onClick={confirmBooking}
          disabled={
            selectedSeats.length === 0 ||
            isBooking
          }
        >
          {isBooking
            ? "Processing..."
            : "Confirm Booking"}
        </button>

      </div>

    </div>
  );
}

export default Booking;