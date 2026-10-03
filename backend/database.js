const Database = require("better-sqlite3");

const db = new Database("movie-booking.db");

db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    duration TEXT NOT NULL,
    rating REAL NOT NULL,
    show_time TEXT NOT NULL
  )
`);

const movieCount = db
  .prepare("SELECT COUNT(*) AS count FROM movies")
  .get();

if (movieCount.count === 0) {
  const insertMovie = db.prepare(`
    INSERT INTO movies
    (title, genre, duration, rating, show_time)
    VALUES (?, ?, ?, ?, ?)
  `);

  const movies = [
    ["Pushpa 2", "Action • Drama", "3h 20m", 4.7, "7:30 PM"],
    ["Kalki 2898 AD", "Sci-Fi • Action", "3h 00m", 4.6, "6:30 PM"],
    ["Devara", "Action • Thriller", "2h 58m", 4.4, "8:00 PM"],
    ["Salaar", "Action • Thriller", "2h 55m", 4.5, "9:00 PM"],
  ];

  const insertMany = db.transaction((movies) => {
    for (const movie of movies) {
      insertMovie.run(...movie);
    }
  });

  insertMany(movies);
}

console.log("SQLite database connected successfully!");

module.exports = db;