const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passValid = require("../middleware/password")

// routes de l'API pour les utilisateurs
router.post('/register', passValid, userCtrl.register);
router.post('/login', userCtrl.login);

// on exporte le router d'authentification des utilisateurs
module.exports = router;