import nodemailer from 'nodemailer';

export const sendEmail = (email, type, token) => {
  // Create a transporter object to send the email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_SECRET,
      pass: process.env.PASSWORD_SECRET,
    }
  });

  // Create the email message
  const mailOptions = {
    from: `"Admin Binus Event" <${process.env.USER_SECRET}@gmail.com>`,
    to: email,
    subject: 'Password reset link',
    text: `You are receiving this email because you (or someone else) has requested a password reset for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    http://binus-event.com/${type}/new-password/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
