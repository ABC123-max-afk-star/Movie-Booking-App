const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Movie Booking Backend is running!",
  });
});

/* =========================
   GET ALL MOVIES
========================= */

app.get("/api/movies", (req, res) => {
  try {
    const movies = db
      .prepare("SELECT * FROM movies")
      .all();

    res.json(movies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get movies",
    });
  }
});

/* =========================
   GET MOVIE BY ID
========================= */

app.get("/api/movies/:id", (req, res) => {
  try {
    const movie = db
      .prepare(
        "SELECT * FROM movies WHERE id = ?"
      )
      .get(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(movie);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get movie",
    });
  }
});

/* =========================
   CREATE BOOKINGS TABLE
========================= */

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    movie_title TEXT NOT NULL,
    theatre TEXT NOT NULL,
    show_time TEXT NOT NULL,
    seats TEXT NOT NULL,
    tickets INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    booking_date TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

/* =========================
   CREATE BOOKING
========================= */

app.post("/api/bookings", (req, res) => {
  try {
    const {
      movie_id,
      movie_title,
      theatre,
      show_time,
      seats,
      tickets,
      total_amount,
    } = req.body;

    if (
      !movie_id ||
      !movie_title ||
      !theatre ||
      !show_time ||
      !seats ||
      !tickets ||
      !total_amount
    ) {
      return res.status(400).json({
        message: "Missing booking details",
      });
    }

    const insertBooking = db.prepare(`
      INSERT INTO bookings
      (
        movie_id,
        movie_title,
        theatre,
        show_time,
        seats,
        tickets,
        total_amount
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertBooking.run(
      movie_id,
      movie_title,
      theatre,
      show_time,
      JSON.stringify(seats),
      tickets,
      total_amount
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking_id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
});

/* =========================
   GET ALL BOOKINGS
========================= */

app.get("/api/bookings", (req, res) => {
  try {
    const bookings = db
      .prepare(
        "SELECT * FROM bookings ORDER BY id DESC"
      )
      .all();

    res.json(bookings);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get bookings",
    });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});