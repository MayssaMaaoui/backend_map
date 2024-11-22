const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Ajouter un nouvel utilisateur
router.post('/addUser', userController.addUser);

// Récupérer la liste des utilisateurs (sans rôle admin)
router.get('/users', userController.getUsers);

// Connexion utilisateur
router.post('/login', userController.loginUser);

// Supprimer un utilisateur par son ID
router.delete('/deleteUser/:userID', userController.deleteUser);

// Mettre à jour un utilisateur par son ID
router.put('/updateUser/:userID', userController.updateUser);

// Changer le mot de passe
router.post('/auth/change-password', userController.changePassword);

//Mot de passe oublier 
router.post('/forgot-password', userController.forgotPassword);


module.exports = router;
