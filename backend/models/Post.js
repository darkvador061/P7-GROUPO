// modèle de données pour les posts
module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("Post", {
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING
    }
  });

  return Post;
};