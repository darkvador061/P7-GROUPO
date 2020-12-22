const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const path = require('path');
const helmet = require("helmet");

// déclaration de la route pour l'authentification
const userRoutes = require('./routes/user');

// déclaration de la route pour le profil utilisateur
const profileRoutes = require('./routes/profile');

// déclaration de la route pour les posts
const postRoutes = require('./routes/post');

// déclaration de la route pour les commentaires
const commentRoutes = require('./routes/comment');

// on créé l'appilcation express
const app = express();

app.use(cors());
app.use(helmet());

// on initialise Sequelize
const db = require("./models");

// on synchronise les modèles
db.sequelize.sync();

// middleware qui permet l'accès à toutes les origines d'accéder à l'API (CORS) 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// middleware qui traîte les données du coprs de la requête en objet JavaScript utilisable
app.use(bodyParser.json());

// middleware qui filtre les chaînes de caractères pour empêcher l’exécution de code JavaScript (XSS)
app.use(expressSanitizer());

// middleware qui définit le chemin static du répertoire des images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// middleware qui définit la route pour l'authentification
app.use('/api/auth', userRoutes);

// middleware qui définit la route pour le profil utilisateur
app.use('/api/profile', profileRoutes);

// middleware qui définit la route des posts
app.use('/api/posts', postRoutes);

// middleware qui définit la route des commentaires
app.use('/api/comment', commentRoutes);

// on exporte express
module.exports = app;