// on importe les modèles de données
const db = require("../models");

// système de fichiers
const fs = require('fs');

// on initialise la base de données
const User = db.User;

// récupère les informations d'un utilisateur
exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
  .then(user => {
    if(!user) return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    return res.status(200).json(user);
  })
  .catch(error => res.status(400).json({ error }));
}

// modifie l'utilisateur
exports.editUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    }
    
    // on contrôle s'il y a une nouvelle image
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

      // on récupère le nom du fichier image depuis la base données
      const filename = user.imageUrl.split('/images/')[1];

      if (filename && filename !=='') {
        // on supprime l'ancienne image
        fs.unlink(`images/${filename}`, function (error) {
          if (error) throw error;
        });
      }

      User.update({ imageUrl: imageUrl }, { where: { id : req.params.id } })
      .then(() => res.status(200).json({ message: 'Utilisateur mis à jour !' }))
      .catch(error => res.status(400).json({ error }));
    }
  })
  .catch(error => res.status(500).json({ error }));
}

// supprime l'utilisateur
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' });
    }
    
    // on récupère le nom du fichier image depuis la base données
    const filename = user.imageUrl.split('/images/')[1];

    if (filename) {
      // on supprime l'image de l'utilisateur
      if (filename !== '') {
        // on supprime l'ancienne image
        fs.unlink(`images/${filename}`, function (error) {
          if (error) throw error;
        });
      } else {
        return res.status(500).json({ error });
      }
    }

    User.destroy({ where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
}