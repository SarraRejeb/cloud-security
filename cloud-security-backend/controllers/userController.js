const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    // Créer l'utilisateur avec isVerified = false
    const user = await User.create({ fullname, email, password, role, isVerified: false });

    // Générer un token de vérification valable 1h
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `http://localhost:5000/api/user/verify-email?token=${token}`;

    // Préparer l'email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM, // doit être un expéditeur validé sur SendGrid
      subject: 'Vérifiez votre compte',
      html: `
        <h3>Bienvenue ${fullname} !</h3>
        <p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour activer votre compte :</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    };

    // Envoyer via SendGrid
    await sgMail.send(msg);

    res.status(201).json({ message: 'Utilisateur créé. Vérifiez vos emails pour activer le compte.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.update({ isVerified: true }, { where: { email: decoded.email } });

    res.send("✅ Email vérifié avec succès. Vous pouvez maintenant vous connecter.");
  } catch (error) {
    res.status(400).send("❌ Lien de vérification invalide ou expiré.");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérifier si email confirmé
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.update(updates, { where: { id: req.user.id }, returning: true });
    res.json(user[1][0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
