// on importe les modèles de données
const db = require("../models");

// package Sequelize
const Sequelize = require("sequelize");

// système de fichiers
const fs = require('fs');

// on initialise la base de données des utilisateurs
const User = db.User;

// on initialise la base de données des posts
const Post = db.Post;

// on initialise la base de données des commentaires
const Comment = db.Comment;

// on initialise la base de données des likes des posts
const PostLikes = db.PostLikes;

// on initialise la base de données des likes des commentaires
const CommentLikes = db.CommentLikes;

// création d'un post
exports.createPost = (req, res, next) => {
  // on traîte les données du coprs de la requête en objet JavaScript utilisable 
  let postObject = JSON.parse(req.body.post)

  // on vérife que l'utilisateur qui fait la requête exsite
  User.findOne({ where: { id: postObject.userId } })
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    }

    if (req.file) {
      postObject = {
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    } else {
      postObject = {
        ...postObject,
        imageUrl: ''
      }
    }

    // on sauvegarde le post
    Post.create(postObject)
    .then(() => res.status(201).json({ message: 'Le nouveau post a été enregistré !' }))
    .catch(error => res.status(500).json({ error: 'Erreur lors de l\'enregistrement du post !' }));
  })
  .catch(error => res.status(500).json({ error }));  
}

// récupère tous les posts
exports.getAllPosts = (req, res, next) => {
  // on tri les posts par ordre décroissant et on recupère les commentaires pour insérer dans la réponse
  Post.findAll({ 
    order: Sequelize.literal('createdAt DESC'),
    include: [
      { model: Comment },
      { model: PostLikes },
      { model: User }
    ]
  })
  .then(posts => {
    if(posts.length < 0) return res.status(404).json({ error: "Aucun posts trouvés !"});

    res.status(200).json(posts)    
  })
  .catch(error => res.status(400).json({ error }));
};

// récupère les informations d'un post
exports.getOnePost = (req, res, next) => {
  // on recupère les commentaires pour insérer dans la réponse
  Post.findOne({ 
    where: { id: req.params.postId },
    include: [
      { model: Comment },
      { model: PostLikes },
      { model: User }
    ]
  })
  .then(post => {
    if(!post) return res.status(404).json({ error: 'Post non trouvé !' });

    res.status(200).json(post);
  })
  .catch(error => res.status(400).json({ error }));
}

// modifie un post
exports.editPost = (req, res, next) => {
  // on traîte les données du coprs de la requête en objet JavaScript utilisable 
  let postObject = JSON.parse(req.body.post);

  // on contrôle s'il y a une nouvelle image
  if (req.file) {
    // on vérife que le post exsite
    Post.findOne({ where: { id: postObject.id } })
    .then(post => {
      // on récupère le nom du fichier image
      const filename = post.imageUrl.split('/images/')[1];

      if (filename) {
        // on supprime l'ancienne image
        fs.unlink(`images/${filename}`, function (error) {
          if (error) throw error;
        });
      } else {
        return res.status(500).json({ error });
      }
    })
    .catch(error => res.status(500).json({ error }));

    // on construit l'objet qui sera mis à jour avec la nouvelle image
    postObject = {
      ...postObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  } else {
    // on construit l'objet qui sera mis à jour
    postObject = {
      ...postObject,
      imageUrl: ''
    }
  }
 
  // on met à jour le post
  Post.update({ id: postObject.id }, { ...postObject, id: postObject.id })
  .then(() => res.status(200).json({ message: 'Le post a été modifié !' }))
  .catch(error => res.status(400).json({ error }));
}

// supprime un post
exports.deletePost = (req, res, next) => {
  // on vérife que le post exsite
  Post.findOne({ where: { id: req.params.postId } })
  .then(post => {
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé !' });
    }

    // on vérife que l'utilisateur qui fait la requête exsite
    User.findOne({ where: { id: post.userId } })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé !' });
      }

      // on vérifie si la requête est envoyé par l'auteur du post ou l'administrateur
      if(user.id !== post.userId) {
        if(!user.isAdmin) return res.status(401).json({ error: 'Accès non autorisé !' });
      }

      // on contrôle s'il y a une image dans le post
      if (post.imageUrl) {
        // on récupère le nom du fichier image depuis la base données
        const filename = post.imageUrl.split('/images/')[1];

        if (filename) {
          // on supprime l'image
          fs.unlink(`images/${filename}`, function (error) {
            if (error) throw error;
          });
        } else {
          return res.status(500).json({ error });
        }
      }

      // on recherche les likes/dislikes du post
      PostLikes.findOne({ where: { postId: req.params.postId } })
      .then(postLikes => {
        if (postLikes) {
          // on efface les likes/dislikes du post
          PostLikes.destroy({ where: { postId: req.params.postId } })
          .catch(error => res.status(400).json({ error }));
        }
      })

      // on recherche tous les commentaires en incluant les likes/dislikes des commentaires
      Comment.findAll({ where: { postId: req.params.postId },
        include: [
          { model: CommentLikes }
        ]
      })
      .then(comments => {        
        // le post ne contient pas de commentaires
        if(comments.length === 0) {         
          // on efface le post
          Post.destroy({ where: { id: req.params.postId} })
          .then(() => res.status(200).json({ message: 'Post supprimé !' }))
          .catch(error => res.status(400).json({ error }));
        // le post contient des commentaires
        } else {
          // on efface les likes/dislikes des commentaires
          comments.map(comment => {
            comment.Comments_Likes.map(likes => {
              CommentLikes.destroy({ where: { commentId: likes.commentId }})
            })
          })

          // on efface les commentaires
          Comment.destroy({where: { postId: comments.map(comment => { return comment.postId }) }})

          // on efface le post
          Post.destroy({ where: { id: req.params.postId } })
          .then(() => res.status(200).json({ message: 'Post supprimé !' }))
          .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error })); 
  })
  .catch(error => res.status(500).json({ error }));
}

// like/dislike d'un post
exports.likeOnePost = (req, res, next) => {
  const userId = req.body.userId;
  const postId = req.body.postId;
  const like = req.body.like;

  Post.findOne({ where: { id: postId } })
  .then((post) => {
    // on vérifie si l'utilisateur a déjà noté le post
    if (like === 0) {
      PostLikes.findOne({ where: { postId: postId, userId: userId } })
      .then(postLikes => {
       
        // on supprime le like/dislike
        if (postLikes.userId === userId) {
          PostLikes.destroy({ where: { postId: postId, userId: userId } })
          .then(() => res.status(201).json({ message: 'L\'utilisateur à retiré son like/dislike !' }))
          .catch(error => res.status(400).json({ error }));
        }
      })
    // on vérifie si l'utilisateur like le post
    } else if (like === 1) {
      // on créé le like
      PostLikes.create({ userId: userId, likes: 1, postId: postId })
      .then(() => {
        PostLikes.findOne({ where: { postId: postId, userId: userId } })
        .then(postLikes => {
          res.status(201).json({ message: 'L\'utilisateur à aimé le post !' })
        })
      })
      .catch(error => res.status(400).json({ error }));

    // on vérifie si l'utilisateur dislike le post
    } else if (like === -1) {
      // on créé le dislike
      PostLikes.create({ userId: userId, dislikes: 1, postId: postId })
      .then(() => {
        PostLikes.findOne({ where: { postId: postId, userId: userId } })
        .then(postLikes => {
          res.status(201).json({ message: 'L\'utilisateur n\'a pas aimé le post !' })
        })
      })
      .catch(error => res.status(400).json({ error }));
    }
  })

  .catch(error => res.status(500).json({ error }));
};