// package pour la gestion des tokens
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on récupère le token dans le header authorization
    const token = req.headers.authorization.split(' ')[1];

    // on décode le token avec la clé secrète
    const decodedToken = jwt.verify(token, 'RAMDOM_TOKEN_SECRET');

    // on récupère l'user ID décodé
    const userId = decodedToken.userId;

    // on récupère l'user ID dans le paramètre de la requête
    const reqUserId = parseInt(req.params.id)

    // on vérifie si l'user ID est différent du paramètre de la requête
    if (reqUserId && reqUserId !== userId || reqUserId === undefined || reqUserId === null) {
      throw 'Identifiant non valable !';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
};
