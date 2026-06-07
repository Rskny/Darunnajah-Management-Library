const nodemailer = require('nodemailer');

// 1. Konfigurasi Transporter (Tukang Pos)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'darunnajahlibrary@gmail.com', // Email perpustakaan kamu
    pass: 'xpvv hbbd sipf cdum'    // App Password dari Google
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

// 3. Fungsi Baru: Mengirim Email Notifikasi Perubahan Password
const sendPasswordChangedEmail = async (userEmail, username) => {
  const mailOptions = {
    from: '"Darunnajah Library" <darunnajahlibrary@gmail.com>',
    to: userEmail,
    subject: '🔒 Keamanan Akun: Kata Sandi Berhasil Diubah',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Notifikasi Keamanan Akun</h2>
        <p>Halo <b>${username}</b>,</p>
        <p>Kami ingin menginformasikan bahwa kata sandi untuk akun Anda di <b>Darunnajah Library</b> telah <b>berhasil diubah</b>.</p>
        <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #3b82f6; color: #475569; margin: 20px 0;">
          Jika Anda merasa tidak melakukan perubahan ini, harap segera hubungi contact email yang ada di landing Page atau lakukan reset kata sandi melalui menu lupa password demi keamanan akun Anda.
        </div>
        <br>
        <p style="margin: 0; color: #64748b; font-size: 14px;">Best Regard,</p>
        <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: bold;">Riska septiany</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Export kedua fungsi agar bisa dipakai di file router mana pun
module.exports = { sendResetPasswordEmail, sendPasswordChangedEmail };