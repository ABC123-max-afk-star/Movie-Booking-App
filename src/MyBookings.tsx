import { useEffect, useState } from "react";

type Booking = {
  id: number;
  movie_id: number;
  movie_title: string;
  theatre: string;
  show_time: string;
  seats: string;
  tickets: number;
  total_amount: number;
  booking_date: string;
};

function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();

      setBookings(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Cannot connect to booking server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">

        <h1>My Bookings</h1>

        <p className="bookings-subtitle">
          View your movie tickets and booking details
        </p>

        {loading && (
          <div className="booking-message">
            Loading bookings...
          </div>
        )}

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="booking-message">
              <h2>No Bookings Found</h2>
              <p>
                You haven't booked any movie tickets yet.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          bookings.length > 0 && (
            <div className="bookings-list">

              {bookings.map((booking) => {

                let seats: number[] = [];

                try {
                  seats = JSON.parse(booking.seats);
                } catch {
                  seats = [];
                }

                return (
                  <div
                    className="booking-card"
                    key={booking.id}
                  >

                    <div className="booking-card-header">

                      <div>
                        <span className="booking-label">
                          Booking ID
                        </span>

                        <h2>
                          #{booking.id}
                        </h2>
                      </div>

                      <span className="booking-status">
                        Confirmed
                      </span>

                    </div>

                    <div className="booking-card-body">

                      <h2>
                        {booking.movie_title}
                      </h2>

                      <div className="booking-info">

                        <div className="booking-info-item">
                          <span>
                            🎭 Theatre
                          </span>

                          <strong>
                            {booking.theatre}
                          </strong>
                        </div>

                        <div className="booking-info-item">
                          <span>
                            🕐 Show Time
                          </span>

                          <strong>
                            {booking.show_time}
                          </strong>
                        </div>

                        <div className="booking-info-item">
                          <span>
                            💺 Seats
                          </span>

                          <strong>
                            {seats.length > 0
                              ? seats.join(", ")
                              : "N/A"}
                          </strong>
                        </div>

                        <div className="booking-info-item">
                          <span>
                            🎟️ Tickets
                          </span>

                          <strong>
                            {booking.tickets}
                          </strong>
                        </div>

                        <div className="booking-info-item">
                          <span>
                            💰 Total Amount
                          </span>

                          <strong>
                            ₹{booking.total_amount}
                          </strong>
                        </div>

                        <div className="booking-info-item">
                          <span>
                            📅 Booking Date
                          </span>

                          <strong>
                            {booking.booking_date}
                          </strong>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </div>
    </div>
  );
}

export default MyBookings;