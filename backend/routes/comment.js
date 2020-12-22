// package express
const express = require('express');


// création d'un routeur
const router = express.Router();

// importations des middleware d'authentification
const auth = require('../middleware/auth');

// contrôleur pour associer la route des commentaires
const commentCtrl = require('../controllers/comment');

// routes de l'API pour les commentaires
router.post('/create', auth, commentCtrl.createComment);
router.get('/', auth, commentCtrl.getAllComments);
router.get('/:id/:commentId', auth, commentCtrl.getOneComment);
router.put('/edit', auth, commentCtrl.editComment);
router.delete('/delete/:id/:commentId', auth, commentCtrl.deleteComment);
router.post('/like', auth, commentCtrl.likeOneComment);

// on exporte le router des commentaires
module.exports = router;