// modèle de données pour les commentaires
module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("Comment", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Comment;
};