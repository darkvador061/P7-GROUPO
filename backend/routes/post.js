// package express
const express = require('express');

// création d'un routeur
const router = express.Router();

// importations des middleware d'authentification et de gestion des images
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// contrôleur pour associer la route des posts
const postCtrl = require('../controllers/post');

// routes de l'API pour les posts
router.post('/create', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id/:postId', auth, postCtrl.getOnePost);
router.put('/edit', auth, postCtrl.editPost);
router.delete('/delete/:id/:postId', auth, postCtrl.deletePost);
router.post('/like', auth, postCtrl.likeOnePost);

// on exporte le router des posts
module.exports = router;