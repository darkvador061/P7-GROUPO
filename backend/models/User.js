// modèle de données pour les utilisateurs
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    },
    email: {
      type: Sequelize.STRING,
      notEmpty: true,
      validate: {
        // on s'assure que les utilisateurs ne peuvent pas partager la même adresse email
        isUnique(value, next) {
          User.findOne({ attributes: ['id', 'firstName', 'lastName', 'email', 'password',  'isAdmin'], where: { email: value } }).done((User) => {
            if (User) {
              return next('User already exist!');
            }
            next();
          });
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  });

  return User;
};