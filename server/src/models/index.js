const User = require('./user.model');
const UserDevices = require('./userDevices.model');
const UserDeviceAssignments = require('./userDeviceAssignments.model');

User.belongsToMany(UserDevices, { 
  through: UserDeviceAssignments, 
  foreignKey: 'userId', 
  otherKey: 'userDeviceId',
  onDelete: 'CASCADE'
});

UserDevices.belongsToMany(User, { 
  through: UserDeviceAssignments, 
  foreignKey: 'userDeviceId', 
  otherKey: 'userId',
  onDelete: 'CASCADE'
});
Film.belongsToMany(Category, { through: 'FilmCategory' });
Category.belongsToMany(Film, { through: 'FilmCategory' });

Film.belongsToMany(Country, { through: 'FilmCountry' });
Country.belongsToMany(Film, { through: 'FilmCountry' });

SeoOnPage.hasMany(BreadCrumb, { foreignKey: 'seoOnPageId' });
BreadCrumb.belongsTo(SeoOnPage);
// Category model
Category.belongsToMany(Film, { through: 'FilmCategory' });
Film.belongsToMany(Category, { through: 'FilmCategory' });

// Country model
Country.belongsToMany(Film, { through: 'FilmCountry' });
Film.belongsToMany(Country, { through: 'FilmCountry' });

// Tmdb & Imdb liên kết với Film
Film.hasOne(Tmdb, { foreignKey: 'filmId' });
Tmdb.belongsTo(Film, { foreignKey: 'filmId' });

Film.hasOne(Imdb, { foreignKey: 'filmId' });
Imdb.belongsTo(Film, { foreignKey: 'filmId' });

// Film có nhiều Episode
Film.hasMany(Episode, { foreignKey: 'filmId' });
Episode.belongsTo(Film, { foreignKey: 'filmId' });


module.exports = {
  User,
  UserDevices,
  UserDeviceAssignments
};
