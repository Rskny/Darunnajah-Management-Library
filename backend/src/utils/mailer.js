const nodemailer = require('nodemailer');

// 1. Konfigurasi Transporter (Tukang Pos)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'darunnajahlibrary@gmail.com', // Ganti dengan email perpustakaan
    pass: 'xpvv hbbd sipf cdum'    // Ganti dengan "App Password" dari Google
  }
});

// 2. Fungsi untuk Mengirim Email Reset
const sendResetPasswordEmail = async (userEmail, resetToken) => {
  const resetLink = `http://localhost:9604/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: '"Darunnajah Library" <darunnajahlibrary@gmail.com>',
    to: userEmail,
    subject: 'Reset Password - Darunnajah Library',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Lupa Password?</h2>
        <p>Kami menerima permintaan reset password untuk akun Anda di <b>Darunnajah Library</b>.</p>
        <p>Silakan klik tombol di bawah ini untuk membuat password baru:</p>
        <a href="${resetLink}" style="background: #1e293b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password Saya
        </a>
        <p style="margin-top: 20px; color: #64748b; font-size: 12px;">Link ini hanya berlaku selama 1 jam.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };