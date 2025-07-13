import nodemailer from 'nodemailer';

const sendEmail = async ({ html, subject, to }) => {
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `CoClinic App <process.env.EMAIL>`,
    to, // we will get email address from the user
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  return info; // used to check if the email has been sent to the user or this email or not exist
};

export default sendEmail;
