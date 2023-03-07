const nodemailer = require('nodemailer');
const { options } = require('../app');

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 25,
    auth: {
      user: '8aff63d039206d',
      pass: '7f7b5912254e85',
    },
  });

  // Define the option Email
  const mailOption = {
    from: 'feraz khan <ferazkhan4@gmail.com>',
    to: 'ferazkhan621@gmail.com',
    subject: options.subject,
    text: options.message,
  };

  // Actually send the mail

  const mailhappen = await transporter.sendMail(mailOption);
  return mailhappen;
};
module.exports = sendMail;
