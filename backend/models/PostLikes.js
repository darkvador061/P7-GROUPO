// modèle de données pour les likes des posts
module.exports = (sequelize, Sequelize) => {
  const PostLikes = sequelize.define("Posts_Likes", {
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

  return PostLikes;
};