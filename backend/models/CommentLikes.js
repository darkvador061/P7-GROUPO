// modèle de données pour les likes des commentaires
module.exports = (sequelize, Sequelize) => {
  const CommentLikes = sequelize.define("Comments_Likes", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: '0',
      allowNull: false
    },
    dislikes: {
      type: Sequelize.INTEGER,
      defaultValue: '0',
      allowNull: false
    }
  });

  return CommentLikes;
};