const nodemailer = require('nodemailer');
const { options } = require('../app');

const sendMail = async (options) => {
  var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "73162b381acc9b",
    pass: "2905554420e45d"
  }
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
