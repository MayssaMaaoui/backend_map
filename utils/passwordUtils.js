const nodemailer = require('nodemailer');

exports.sendResetEmail = (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'imen40169@gmail.com',
            pass: 'iweu rtjb kxem insd',
        },
    });

    const mailOptions = {
        from: 'imen40169@gmail.com',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Utilisez ce lien pour réinitialiser votre mot de passe : http://localhost:3000/reset-password/${resetToken}`,
    };

    return transporter.sendMail(mailOptions);
};

exports.generateResetToken = () => {
    return Math.random().toString(36).substr(2); // Simple token aléatoire
};
