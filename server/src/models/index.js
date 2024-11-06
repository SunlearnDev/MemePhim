const User = require("./user.model");
const UserDevices = require("./userDevices.model");
const UserDeviceAssignments = require("./userDeviceAssignments.model");
const Movie = require("./movie.model");
const Tmdb = require("./tmdb.model");
const Imdb = require("./imdb.model");
const Episode = require("./episode.model");
const MovieCountry = require("./movieCountry.model");
const Category = require("./category.model");
const Country = require("./country.model");
const MovieCategory = require("./movieCategory.model");
const SavedMovie = require("./savemovie.model");
const Ratingmovie = require("./ratingMovie.model");
const WatchHistory = require("./watchHistory.model");

User.belongsToMany(UserDevices, {
  through: UserDeviceAssignments,
  foreignKey: "userId",
  otherKey: "userDeviceId",
  onDelete: "CASCADE",
});

UserDevices.belongsToMany(User, {
  through: UserDeviceAssignments,
  foreignKey: "userDeviceId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

Movie.belongsToMany(Country, {
  through: MovieCountry,
  foreignKey: "movieId", as: "countries"
});
Country.belongsToMany(Movie, {
  through: MovieCountry,
  foreignKey: "countryId", as: "movie"
});

Movie.belongsToMany(Category, {
  through: MovieCategory,
  foreignKey: "movieId", as: "categories"
});
Category.belongsToMany(Movie, {
  through: MovieCategory,
  foreignKey: "categoryId", as: "movie"
});

// Tmdb & Imdb liên kết với movie
Movie.hasOne(Tmdb, { foreignKey: "movieId", as: "tmdbs" });
Tmdb.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

Movie.hasOne(Imdb, { foreignKey: "movieId", as: "imbds" });
Imdb.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

// movie có nhiều Episode

Movie.hasMany(Episode, { foreignKey: "movieId",as: "episodes" });
Episode.belongsTo(Movie, { foreignKey: "movieId",as: "movie" });
// Saved Movies: Nhiều người dùng có thể lưu nhiều phim, và một phim có thể được nhiều người lưu
User.belongsToMany(Movie, {
  through: SavedMovie,
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Movie.belongsToMany(User, {
  through: SavedMovie,
  foreignKey: "movieId",
  onDelete: "CASCADE",
});

// Một người dùng có thể đánh giá nhiều phim
User.hasMany(Ratingmovie, { foreignKey: 'userId', as: 'ratings' });
Ratingmovie.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Một phim có thể nhận được nhiều đánh giá từ nhiều người dùng
Movie.hasMany(Ratingmovie, { foreignKey: 'movieId', as: 'ratings' });
Ratingmovie.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

User.hasMany(WatchHistory, { foreignKey: 'userId', as: 'watchHistories' });
WatchHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Một phim có thể nằm trong nhiều lịch sử xem của nhiều người dùng
Movie.hasMany(WatchHistory, { foreignKey: 'movieId', as: 'watchHistories' });
WatchHistory.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

module.exports = {
  User,
  UserDevices,
  UserDeviceAssignments,
  Movie,
  Tmdb,
  Imdb,
  Episode,
  MovieCountry,
  Category,
  Country,
  MovieCategory,
  WatchHistory,
  Ratingmovie,
  SavedMovie
};
