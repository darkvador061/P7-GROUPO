// package express
const express = require('express');

// création d'un routeur
const router = express.Router();

// importations des middleware d'authentification et de gestion des images
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// contrôleur pour associer la route profile
const profileCtrl = require('../controllers/profile');

// routes de l'API pour le profile
router.get('/:id', auth, profileCtrl.getOneUser);
router.put('/edit/:id', auth, multer, profileCtrl.editUser);
router.delete('/delete/:id', auth, profileCtrl.deleteUser);

// on exporte le router du profile utilisateur
module.exports = router;