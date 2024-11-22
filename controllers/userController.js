const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passwordUtils = require('../utils/passwordUtils');

// Fonction pour générer un mot de passe aléatoire
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Fonction pour générer un token JWT
const generateAuthToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );

  return token;
};

// Login utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = generateAuthToken(user);

    res.status(200).json({
      token,
      userId: user._id,
      userName: user.name,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un utilisateur
const addUser = async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    const generatedPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    sendPasswordEmail(email, generatedPassword);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Envoyer le mot de passe via email
const sendPasswordEmail = (userEmail, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'imen40169@gmail.com',
      pass: 'iweu rtjb kxem insd',
    },
  });

  const mailOptions = {
    from: 'imen40169@gmail.com',
    to: userEmail,
    subject: 'Vos informations de connexion',
    text: `Bonjour,\n\nVoici vos informations de connexion :\nEmail : ${userEmail}\nMot de passe : ${password}\n\nVeuillez changer votre mot de passe après la première connexion.\n\nCordialement, \nL'équipe admin.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    } else {
      console.log('Email envoyé :', info.response);
    }
  });
};

// Changer le mot de passe
const changePassword = async (req, res) => {
  const { userID, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Obtenir tous les utilisateurs (hors admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findByIdAndDelete(userID);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { userID } = req.params;
  const { name, email, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { name, email, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const { generateResetToken, sendResetEmail } = require('../utils/passwordUtils'); // Fonctions utilitaires

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Rechercher l'utilisateur dans la base de données
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }

        // Générer un token de réinitialisation
        const resetToken = generateResetToken(); // Fonction à définir
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // Valable pendant 1 heure
        await user.save();

        // Envoyer un e-mail
        sendResetEmail(email, resetToken); // Fonction pour envoyer un e-mail

        res.json({ success: true, message: 'Un e-mail de réinitialisation a été envoyé.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur du serveur', error });
    }
};
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
      const user = await User.findOne({
          resetToken: token,
          resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
          return res.status(400).json({ message: 'Token invalide ou expiré.' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;

      await user.save();
      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  addUser,
  getUsers,
  loginUser,
  deleteUser,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
